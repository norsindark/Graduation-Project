import axios from '../utils/axios-customize';


interface RegisterParams {
    email: string;
    password: string;
    fullName: string;
}


export const callRegister = (params: RegisterParams)=> {
    return axios.post('/api/v1/auth/sign-up', params);
}

