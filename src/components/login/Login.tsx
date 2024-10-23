import {ChangeEvent, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AuthService} from "../../services/auth.service";
import {ServiceErrorCode} from "../../services/service.result";
import {ILogin} from "../../models/login.model";
import "./Login.css";
import { IUser, IUserId } from "../../models/user.model";

function Login() {

    const [log, setLog] = useState<ILogin>({
        login: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState<string>();
    const navigate = useNavigate();

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        const text = event.target.value;
        setLog((old) => {
            old.login = text;
            return old;
        });
    }

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        const text = event.target.value;
        setLog((old) => {
            old.password = text;
            return old;
        });
    }

    const handleLogin = async () => {
        console.log('Hellooo')
        const res = await AuthService.login(log);
        if(res.errorCode === ServiceErrorCode.success && res.result) {
            const { token, user } = res.result;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user)); 
            console.log(token);
            if(res.result.user.accesses === 100) {
                navigate('/users');
                return;
            }if(res.result.user.accesses === 50){
                navigate(`/salles/owner/${res.result.user._id}`);
                return;
            }
            navigate('/salles');
            return;
        }
        if(res.errorCode === ServiceErrorCode.notFound) {
            setErrorMessage('Invalid credentials');
            return;
        }
        setErrorMessage('Internal server error');
    };

    return (
        <div id={"login-container"}>
            <h1>Login</h1>
            <label>Identifiant :</label><br></br>
            <input type="text" placeholder='Identifiant' onChange={handleEmailChange}/><br></br>
            <label>Password :</label><br></br>
            <input type="password" placeholder='Password' onChange={handlePasswordChange}/><br></br>
            {
                errorMessage &&
                <p id="login-error-message">{errorMessage}</p>
            }
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}

export default Login;