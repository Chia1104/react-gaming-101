'use client';

import { useState, useMemo, useId, memo } from 'react';
import { ViewTransition } from 'react';

import { CSS } from '@dnd-kit/utilities';
import { X, GripVertical } from 'lucide-react';
import { motion, useAnimation } from 'motion/react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useDarkMode from '@/hooks/useDarkMode';
import { Controller as DndController } from '@/libs/dnd/components/controlled-item';
import { Provider as DndProvider } from '@/libs/dnd/components/provider';
import { cn } from '@/libs/utils/cn';
import { useTodoStore } from '@/stores/todo/store';

const WHEEL_SIZE = 400;
const CENTER_X = WHEEL_SIZE / 2;
const CENTER_Y = WHEEL_SIZE / 2;
const RADIUS = WHEEL_SIZE / 2 - 20;

interface WheelSegment {
	id: string;
	label: string;
	angle: number;
	color: string;
}

function generateColors(count: number): string[] {
	const colors = [
		'#FF6B6B',
		'#4ECDC4',
		'#45B7D1',
		'#FFA07A',
		'#98D8C8',
		'#F7DC6F',
		'#BB8FCE',
		'#85C1E2',
		'#F8B739',
		'#48C9B0',
		'#EC7063',
		'#5DADE2',
	];

	const result: string[] = [];
	for (let i = 0; i < count; i++) {
		result.push(colors[i % colors.length] || `hsl(${(i * 137.5) % 360}, 70%, 60%)`);
	}
	return result;
}

function createWheelSegments(options: { id: string; text: string }[]): WheelSegment[] {
	if (options.length === 0) return [];

	const colors = generateColors(options.length);
	const anglePerSegment = 360 / options.length;

	return options.map((item, index) => ({
		id: item.id,
		label: item.text,
		angle: index * anglePerSegment,
		color: colors[index],
	}));
}

function drawWheelSegment(
	segment: WheelSegment,
	totalSegments: number,
	svgPath: string[],
	textElements: { x: number; y: number; text: string; rotation: number }[],
) {
	const anglePerSegment = 360 / totalSegments;
	const startAngle = segment.angle;
	const endAngle = startAngle + anglePerSegment;

	const startAngleRad = ((startAngle - 90) * Math.PI) / 180;
	const endAngleRad = ((endAngle - 90) * Math.PI) / 180;

	const x1 = CENTER_X + RADIUS * Math.cos(startAngleRad);
	const y1 = CENTER_Y + RADIUS * Math.sin(startAngleRad);
	const x2 = CENTER_X + RADIUS * Math.cos(endAngleRad);
	const y2 = CENTER_Y + RADIUS * Math.sin(endAngleRad);

	const largeArcFlag = anglePerSegment > 180 ? 1 : 0;

	const path = `M ${CENTER_X} ${CENTER_Y} L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
	svgPath.push(path);

	// 計算文字位置（在扇形中間）
	const midAngle = (startAngle + endAngle) / 2;
	const midAngleRad = ((midAngle - 90) * Math.PI) / 180;
	const textRadius = RADIUS * 0.7;
	const textX = CENTER_X + textRadius * Math.cos(midAngleRad);
	const textY = CENTER_Y + textRadius * Math.sin(midAngleRad);

	textElements.push({
		x: textX,
		y: textY,
		text: segment.label,
		rotation: midAngle,
	});
}

function calculateWinningSegment(rotation: number, segments: WheelSegment[]): number {
	if (segments.length === 0) return -1;

	// 將旋轉角度正規化到 0-360 範圍
	const normalizedRotation = ((rotation % 360) + 360) % 360;

	// 指針指向頂部（0度），但轉盤是順時針旋轉，所以需要反轉
	const pointerAngle = (360 - normalizedRotation) % 360;

	const anglePerSegment = 360 / segments.length;

	// 找到指針指向的扇形
	let winningIndex = Math.floor(pointerAngle / anglePerSegment);

	// 處理邊界情況
	if (winningIndex >= segments.length) {
		winningIndex = 0;
	}

	return winningIndex;
}

const OptionList = memo(
	({ isSpinning }: { isSpinning: boolean }) => {
		const options = useTodoStore(state => state.items, 'OptionList');
		const resetTodos = useTodoStore(state => state.resetTodos, 'OptionList');
		const removeTodo = useTodoStore(state => state.removeTodo, 'OptionList');
		const t = useTranslations();

		return options.length > 0 ? (
			<div className="space-y-2">
				<Label>
					{t('roulette.options')} ({options.length})
				</Label>
				<DndProvider
					data={options}
					onDragEnd={(_item, newData) => {
						resetTodos(newData);
					}}
				>
					<div className="flex flex-wrap gap-2">
						{options.map(option => (
							<DndController key={option.id} data={option}>
								{sortable => (
									<div
										className="flex items-center gap-2 px-1 py-1.5 rounded-md bg-background border border-border"
										ref={sortable.setNodeRef}
										style={{
											transform: CSS.Transform.toString(sortable.transform),
											transition: sortable.transition,
										}}
									>
										<Button
											size="icon-sm"
											variant="ghost"
											className={cn('p-0.5 size-5', sortable.isDragging && 'cursor-grabbing')}
											disabled={isSpinning}
											{...sortable.attributes}
											{...sortable.listeners}
										>
											<GripVertical className="size-3" />
										</Button>
										<span className="text-sm">{option.text}</span>
										<Button
											size="icon-sm"
											variant="ghost"
											onClick={() => removeTodo(option.id)}
											disabled={isSpinning}
											className="text-destructive hover:text-destructive/80 text-xs font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed p-0.5 size-5"
										>
											<X className="size-4" />
										</Button>
									</div>
								)}
							</DndController>
						))}
					</div>
				</DndProvider>
			</div>
		) : null;
	},
	(prev, next) => prev.isSpinning === next.isSpinning,
);

export const Roulette = () => {
	const t = useTranslations();
	const id = useId();
	const options = useTodoStore(state => state.items, 'Roulette');
	const addTodo = useTodoStore(state => state.addTodo, 'Roulette');
	const clearTodos = useTodoStore(state => state.clearTodos, 'Roulette');
	const { isDarkMode } = useDarkMode();

	const [inputValue, setInputValue] = useState('');
	const [isSpinning, setIsSpinning] = useState(false);
	const [winner, setWinner] = useState<string | null>(null);
	const [currentRotation, setCurrentRotation] = useState(0);
	const controls = useAnimation();

	const segments = useMemo(() => createWheelSegments(options), [options]);

	const { svgPath, textElements } = useMemo(() => {
		const paths: string[] = [];
		const texts: { x: number; y: number; text: string; rotation: number }[] = [];

		segments.forEach(segment => {
			drawWheelSegment(segment, segments.length, paths, texts);
		});

		return { svgPath: paths, textElements: texts };
	}, [segments]);

	const handleAddOption = () => {
		const trimmed = inputValue.trim();
		if (trimmed && !options.some(item => item.text === trimmed)) {
			addTodo(trimmed);
			setInputValue('');
			setWinner(null);
		}
	};

	const handleSpin = async () => {
		if (options.length < 2 || isSpinning) return;

		setIsSpinning(true);
		setWinner(null);

		// 標準化當前旋轉角度到 0-360 範圍，避免累積誤差
		const normalizedRotation = currentRotation % 360;
		controls.set({ rotate: normalizedRotation });

		// 固定轉動角度（固定轉 5 圈）
		const spins = 5;
		const randomAngle = Math.random() * 360;
		const totalRotation = normalizedRotation + spins * 360 + randomAngle;

		await controls.start({
			rotate: totalRotation,
			transition: {
				duration: 5, // 固定 5 秒
				ease: [0.19, 1, 0.22, 1], // easeOutExpo 緩動函數，從快速開始，平滑減速結束
			},
		});

		// 更新狀態為最終旋轉角度
		setCurrentRotation(totalRotation);

		const winningIndex = calculateWinningSegment(totalRotation, segments);
		setWinner(segments[winningIndex].label || null);
		setIsSpinning(false);
	};

	const handleReset = () => {
		clearTodos();
		setInputValue('');
		setWinner(null);
		setCurrentRotation(0);
		controls.set({ rotate: 0 });
	};

	return (
		<ViewTransition>
			<div className="rounded-2xl shadow-2xl p-8 max-w-4xl w-full bg-foreground/5 backdrop-blur-xl flex flex-col items-center justify-center gap-8">
				<h2 className="text-4xl font-bold text-center">{t('routes.roulette.title')}</h2>

				{/* 輸入選項區域 */}
				<div className="w-full max-w-md space-y-4">
					<div className="grid w-full items-center gap-2">
						<Label htmlFor={id}>{t('roulette.add-option')}</Label>
						<div className="flex w-full items-center gap-2">
							<Input
								id={id}
								placeholder={t('roulette.option-placeholder')}
								value={inputValue}
								onChange={e => setInputValue(e.target.value)}
								onKeyDown={e => {
									if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
										handleAddOption();
									}
								}}
								disabled={isSpinning}
							/>
							<Button onClick={handleAddOption} disabled={isSpinning || !inputValue.trim()}>
								{t('roulette.add')}
							</Button>
						</div>
					</div>

					{/* 選項列表 */}
					<OptionList isSpinning={isSpinning} />
				</div>

				{/* 轉盤區域 */}
				<div className="relative flex flex-col items-center gap-6">
					{options.length >= 2 ? (
						<>
							<div className="relative" style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}>
								{/* 指針（固定在頂部） */}
								<div
									className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
									style={{
										width: 0,
										height: 0,
										borderLeft: '15px solid transparent',
										borderRight: '15px solid transparent',
										borderTop: '30px solid #ef4444',
									}}
								/>

								{/* SVG 轉盤 */}
								<motion.svg
									width={WHEEL_SIZE}
									height={WHEEL_SIZE}
									viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
									className="rounded-full"
									style={{ originX: 0.5, originY: 0.5 }}
									animate={controls}
								>
									<title>Roulette Wheel</title>
									<g>
										{segments.map((segment, index) => (
											<path
												key={index}
												d={svgPath[index]}
												fill={segment.color}
												stroke={isDarkMode ? '#212121' : '#fff'}
												strokeWidth="2"
											/>
										))}
									</g>
									{textElements.map((text, index) => (
										<text
											key={index}
											x={text.x}
											y={text.y}
											textAnchor="middle"
											dominantBaseline="middle"
											fontSize="14"
											fontWeight="600"
											fill={isDarkMode ? '#212121' : '#fff'}
											transform={`rotate(${text.rotation}, ${text.x}, ${text.y})`}
											style={{ pointerEvents: 'none' }}
										>
											{text.text}
										</text>
									))}
								</motion.svg>
							</div>

							{/* 操作按鈕 */}
							<div className="flex gap-4">
								<Button onClick={handleSpin} disabled={isSpinning || options.length < 2} size="lg">
									{isSpinning ? t('roulette.spinning') : t('roulette.spin')}
								</Button>
								<Button onClick={handleReset} variant="outline" disabled={isSpinning} size="lg">
									{t('action.reset')}
								</Button>
							</div>

							{/* 顯示結果 */}
							{winner && (
								<div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20 min-w-64">
									<p className="text-lg font-semibold text-muted-foreground mb-1">{t('roulette.result')}</p>
									<p className="text-2xl font-bold text-primary">{winner}</p>
								</div>
							)}
						</>
					) : (
						<div className="flex flex-col items-center justify-center gap-4 p-12 text-center text-muted-foreground">
							<p className="text-lg">{t('roulette.min-options')}</p>
							<p className="text-sm">{t('roulette.add-more-options')}</p>
						</div>
					)}
				</div>

				{/* 說明文字 */}
				<div className="mt-4 text-center text-sm text-muted-foreground">
					<p>{t('routes.roulette.description')}</p>
				</div>
			</div>
		</ViewTransition>
	);
};
