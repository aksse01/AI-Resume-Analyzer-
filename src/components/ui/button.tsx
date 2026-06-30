import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
};

export function Button({ className, variant = "ghost", ...props }: ButtonProps) {
  return <button className={cn("button", variant === "primary" && "button-primary", variant === "danger" && "button-danger", className)} {...props} />;
}

export function LinkButton({
  href,
  children,
  variant = "ghost"
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}) {
  return (
    <Link className={cn("button", variant === "primary" && "button-primary")} href={href}>
      {children}
    </Link>
  );
}
