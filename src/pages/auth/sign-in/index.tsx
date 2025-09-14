import Silk from "@/components/aurora";
import { IconReportMedical } from "@tabler/icons-react";
import CircularText from "@/components/curvedloop";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

export default function SignIn2() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated()) {
      navigate("/", { replace: true });
    }
  }, [auth, navigate]);

  const demoUsers = [
    { label: "Admin", email: "admin@example.com", password: "admin123" },
    { label: "Collector", email: "dc@jk.com", password: "dc@123" },
    { label: "Municipal Officer", email: "municipleofficer@example.com", password: "mc@123" },
  ];

  const handleDemoLogin = async (u: { email: string; password: string }) => {
    const ok = await auth.login(u.email, u.password);
    if (ok) {
      toast.success(`Logged in as ${u.email}`);
      navigate("/", { replace: true });
    } else {
      toast.error("Demo login failed");
    }
  };

  return (
    <div className="relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0">
          <Silk
            speed={5}
            scale={1}
            color="#5227ff"
            noiseIntensity={1.5}
            rotation={0}
          />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <IconReportMedical className="mr-2 h-6 w-6" />
          FixMyStreet
        </div>

        {/* <img
          src="https://dynamic.design.com/asset/logo/a18a548f-c917-404c-8a57-7c30b0e7aa54/logo-search-grid-2x?logoTemplateVersion=2&v=638879732415700000&text=Healthcare+DMS&layout=auto"
          className="relative m-auto"
          width={301}
          height={60}
          alt="Vite"
        /> */}

        <div className="relative z-20 mt-auto flex flex-col items-center space-y-4">
          <CircularText
            text="FIXMYSTREET☆CIVIC☆ENGAGEMENT☆"
            onHover="speedUp"
            spinDuration={20}
            className="custom-class"
          />
        </div>

        <div className="relative z-20 mt-auto">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold leading-tight">
              Welcome to FixMyStreet Demo
            </h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Report, track and manage local civic issues. Explore different
              roles using demo credentials—no real data required.
            </p>
            <div className="flex items-center space-x-4 text-sm text-white/80">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                HIPAA Compliant
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-4 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-left mb-2">
            <h1 className="text-2xl font-semibold tracking-tight">Demo Login</h1>
            <p className="text-muted-foreground text-sm">
              Pick a role below to explore FixMyStreet.
            </p>
          </div>
          <div className="grid gap-3">
            {demoUsers.map((u) => (
              <Button key={u.email} onClick={() => handleDemoLogin(u)} variant="outline">
                Continue as {u.label}
              </Button>
            ))}
          </div>
          <div className="mt-4 rounded-md border p-3 bg-muted/40">
            <p className="text-xs font-medium mb-2">Demo Credentials</p>
            <ul className="space-y-1 text-xs font-mono">
              {demoUsers.map(u => (
                <li key={u.email}>
                  {u.label}: {u.email} / <span className="select-all">{u.password}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-muted-foreground px-2 text-center text-xs mt-4">
            This environment uses a simplified in-browser demo auth. Do not enter
            real credentials.
          </p>
        </div>
      </div>
    </div>
  );
}
