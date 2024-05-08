import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";

const NotPermitted = () => {
    const navigate = useNavigate();

    return (
        <Result
            status="403"
            title="403"
            subTitle="Sorry, The page you visited does not exist."
            extra={
                <Button type="primary" onClick={() => navigate('/')}>Back Home</Button>
            }
        />
    )
}

export default NotPermitted;