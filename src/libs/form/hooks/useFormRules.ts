import { useMemo } from 'react';

import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

export const useFormRules = () => {
	const intl = useTranslations('validation');
	const messages = useMemo(
		() => ({
			primitive: {
				required_error: intl('required'),
				invalid_type_error: intl('invalid-type'),
			},
		}),
		[intl],
	);

	const patterns = useMemo(
		() => ({
			/**
			 * 電子郵件
			 */
			email: z.email({
				error: intl('pattern.email'),
			}),
			/**
			 * 必填字串
			 */
			required: z
				.string({
					error: messages.primitive.invalid_type_error,
				})
				.min(1, {
					error: messages.primitive.required_error,
				}),
			/**
			 * URL 格式
			 */
			url: z.union([
				z
					.url({
						error: intl('pattern.url'),
					})
					.startsWith('http://', {
						error: intl('pattern.url'),
					}),
				z
					.url({
						error: intl('pattern.url'),
					})
					.startsWith('https://', {
						error: intl('pattern.url'),
					}),
			]),
			/**
			 * dayjs 實例
			 */
			dayjs: z.instanceof(dayjs as unknown as typeof dayjs.Dayjs, {
				error: messages.primitive.invalid_type_error,
			}),
			/**
			 * 時間戳
			 */
			timeStamps: z.number({
				error: messages.primitive.invalid_type_error,
			}),
			/**
			 * 數字字串
			 */
			numericString: z
				.string({
					error: messages.primitive.invalid_type_error,
				})
				.pipe(
					z.coerce.number({
						error: messages.primitive.invalid_type_error,
					}),
				),
			/**
			 * 大於 0 的整數
			 */
			moreThenZeroNumber: z
				.number({
					error: intl('pattern.more-than-0'),
				})
				.int({
					error: intl('pattern.more-than-0'),
				})
				.positive({
					error: intl('pattern.more-than-0'),
				}),
			/**
			 * 整數
			 */
			intNumber: z
				.number({
					error: intl('pattern.number'),
				})
				.int({
					error: intl('pattern.number'),
				}),
			number: z.number({
				error: intl('pattern.number'),
			}),
			/**
			 * 大於等於 0 的整數
			 */
			greaterThanOrEqualToZeroNumber: z
				.number({
					error: intl('pattern.number'),
				})
				.int({
					error: intl('pattern.number'),
				})
				.min(0, {
					error: intl('pattern.number'),
				}),
			/**
			 * 字串 允許空字串
			 */
			text: z.string({
				error: messages.primitive.invalid_type_error,
			}),
			/**
			 * 布林值
			 */
			boolean: z.boolean({
				error: messages.primitive.invalid_type_error,
			}),
			/**
			 * 大整數
			 */
			bigint: z.bigint({
				error: messages.primitive.invalid_type_error,
			}),
		}),
		[intl, messages.primitive],
	);

	return {
		messages,
		patterns,
	};
};
