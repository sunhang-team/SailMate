import { z } from 'zod';

const nicknameField = z
  .string()
  .min(1, '닉네임은 필수 입력입니다.')
  .min(2, '닉네임은 최소 2자 이상입니다.')
  .max(10, '닉네임은 최대 10자까지 가능합니다.');

const newPasswordField = z
  .string()
  .min(1, '비밀번호는 필수 입력입니다.')
  .min(8, '비밀번호는 최소 8자 이상입니다.')
  .refine(
    (value) => {
      const hasNumber = /[0-9]/.test(value);
      const hasAlphabet = /[a-zA-Z]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      return hasNumber && hasAlphabet && hasSpecialChar;
    },
    { message: '비밀번호는 숫자, 영문, 특수문자를 포함해야 합니다.' },
  );

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const updateProfileFormSchema = z.object({
  nickname: nicknameField.optional(),
  profileImage: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_PROFILE_IMAGE_SIZE, '프로필 이미지는 5MB 이하여야 합니다.')
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), '프로필 이미지는 jpg, png, webp 형식만 가능합니다.')
    .nullable()
    .optional(),
});

export const updatePasswordRequestSchema = z.object({
  currentPassword: z.string().min(1, '현재 비밀번호를 입력해 주세요.'),
  newPassword: newPasswordField,
});

export const updatePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, '현재 비밀번호를 입력해 주세요.'),
    newPassword: newPasswordField,
    newPasswordConfirmation: z.string().min(1, '비밀번호 확인을 입력해 주세요.'),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['newPasswordConfirmation'],
  });
