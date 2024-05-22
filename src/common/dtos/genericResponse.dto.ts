
export class GenericResponse<T> {
    code: string;
    message: string;
    data: T; // Datos opcionales

    constructor(code: string, message: string, data: T) {
        this.code = code;
        this.message = message;
        this.data = data
    }
}