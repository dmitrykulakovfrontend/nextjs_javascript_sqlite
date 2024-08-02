import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useState} from "react";
import {signIn} from "next-auth/react";

function LoginForm() {
    const [user, setUser] = useState({
        username: "",
        password: "",
    });
    async function handleSubmit(e) {
        e.preventDefault();
        const res = await fetch("/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: user.username,
                password: user.password,
            }),
        });
        const data = await res.json();
        console.log(data);
        if (!data.user) return null;
        await signIn("credentials", {
            username: data.user.username,
            password: user.password,
            callbackUrl: "/dashboard",
        });
    }
    return (
        <div className="flex items-center justify-center min-w-full min-h-screen">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">
                        Create new account
                    </CardTitle>
                    <CardDescription>
                        Enter your username and password below to create your
                        new account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="username"
                            required
                            placeholder="Example"
                            className="w-full rounded-lg bg-background  md:w-[200px] lg:w-[336px]"
                            value={user.username}
                            onChange={e =>
                                setUser({
                                    ...user,
                                    username: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={user.password}
                            onChange={e =>
                                setUser({
                                    ...user,
                                    password: e.target.value,
                                })
                            }
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleSubmit}>
                        Create account
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
export default LoginForm;
