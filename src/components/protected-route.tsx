import { auth } from "../routes/firebase";
import { onAuthStateChanged } from "firebase/auth";


export default function ProtectedRoute({
    children,
}:{
    children:React.ReactNode;
}){
    onAuthStateChanged(auth, (user) => {
        if (user === null) {
            // 비로그인 상태에서 실행할 함수
        }
    });
    return children
}