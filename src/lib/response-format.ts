export interface ResponseFormat {
    code?: number | string;
    status?: 'success' | 'error';
    message?: string;
    data?: any
}

export const resSuccess = (data:ResponseFormat) => {
    return {
        code: data.code || 200,
        status: data.status || 'success',
        message: data.message || 'Success!',
        data: data.data || null
    }
}

export const resError = (data:ResponseFormat) => {
    return {
        code: data.code || 500,
        status: data.status || 'error',
        message: data.message || 'Error!',
        data: data.data || null
    }
}