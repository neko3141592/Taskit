interface APIResponse<T> {
    data: T;
    message: string;
    success: boolean;
}