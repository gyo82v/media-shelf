import {Spinner} from "@/components/ui/Spinner"
import {
  buttonPrimaryStyle,
  buttonSecondaryStyle,
  buttonDangerStyle,
  buttonIconStyle,
  buttonConfirmStyle,
  buttonPrimaryDangerStyle
} from "@/styles";

type ButtonVariant = "primary" | "secondary" | "danger" | "icon" | "confirm" | "primaryDanger";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode
    variant?: ButtonVariant
    className?: string
    loading?: boolean 
    loadingText?: string
    disabled?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: buttonPrimaryStyle,
  secondary: buttonSecondaryStyle,
  danger: buttonDangerStyle,
  icon: buttonIconStyle,
  confirm: buttonConfirmStyle,
  primaryDanger: buttonPrimaryDangerStyle
};

export default function Button({variant="primary", className="", loading= false, children, disabled, loadingText, ...props}:Props){
    const isDisabled = disabled || loading
    return(
        <button 
          {...props} 
          className={`${className} ${variantStyles[variant]}
                      relative inline-flex items-center justify-center whitespace-nowrap`} 
          aria-busy={loading}
          disabled={isDisabled}
        >
            <span className={`inline-flex items-center justify-center gap-1
                              ${loading ? "invisible" : ""}`}>
                {children}
            </span>
            <span>
                {loading && 
                <span className="absolute inset-0 flex items-center justify-center gap-2">
                    <Spinner className="h-4 w-4 shrink-0" />
                    {loadingText ? <span>{loadingText}</span> : null}
                </span>
                }
            </span>
        </button>
    )
}