import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.string().min(1, '이메일은 필수 입력입니다.').pipe(z.email('이메일 형식으로 작성해 주세요.')),
  password: z.string().min(1, '비밀번호는 필수 입력입니다.'),
});

export const signupFormSchema = z
  .object({
    email: z.string().min(1, '이메일은 필수 입력입니다.').pipe(z.email('이메일 형식으로 작성해 주세요.')),
    nickname: z
      .string()
      .min(1, '닉네임은 필수 입력입니다.')
      .min(2, '닉네임은 최소 2자 이상입니다.')
      .max(10, '닉네임은 최대 10자까지 가능합니다.'),
    password: z
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
      ),
    passwordConfirmation: z.string().min(1, '비밀번호 확인을 입력해 주세요.'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirmation'],
  });
