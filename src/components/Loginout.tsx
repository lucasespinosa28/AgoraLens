import { useLogout } from "@lens-protocol/react";
import { Button } from "./ui/button";

export default function Loginout() {
    const { execute, error } = useLogout();

    const handleLogout = async () => {
        await execute();
        if (error) {
            alert(`Logout error: ${error.message || error}`);
        }
    };

    return (
        <>
            <p>{error && `Logout error: ${error.message || error}`}</p>
            <Button onClick={handleLogout}>
                Logout
            </Button>
        </>
    );
}
