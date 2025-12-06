import z, { email } from 'zod'

export const SignUpSchema = z.object({
    username: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, "Password must contain uppercase, lowercase, number, and special character")
})