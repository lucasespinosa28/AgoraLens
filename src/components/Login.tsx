import { useWalletClient } from "wagmi";
import { useLoginAction } from '@lens-protocol/react';
import { signMessageWith } from '@lens-protocol/react/viem';
import { Button } from "./ui/button";

export default function Login({ lensAddress, walletAddress }: { lensAddress: string, walletAddress: string }) {
    const { data: walletClient } = useWalletClient();
    const { execute, loading } = useLoginAction();

    const handleLogin = async () => {
        if (!walletClient || !walletAddress) return;
        const result = await execute({
            accountOwner: {
                account: lensAddress,
                app: import.meta.env.VITE_PUBLIC_LENS_APP_ADDRESS,
                owner: walletAddress,
            },
            signMessage: signMessageWith(walletClient),
        });
        if (result.isOk()) {
            console.log("SessionClient", result.value);
        } else {
            console.error("Login failed", result.error);
        }
    };

    return (
            <Button onClick={handleLogin} disabled={loading}>
                {loading ? 'Authenticating...' : 'Login with Lens'}
            </Button>
    )
}