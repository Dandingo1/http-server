import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
}

export async function checkPasswordHash(
    password: string,
    hash: string
): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}
