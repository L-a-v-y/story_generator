
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length < 6) {
      toast({
        title: "Error",
        description: "Please enter a valid verification code",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, verify OTP with API
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      navigate("/reset-password");
      
      toast({
        title: "Success",
        description: "OTP verified successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid verification code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="bg-primary rounded-full p-3">
            <BookOpen className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Verify Code</CardTitle>
            <CardDescription className="text-center">
              Enter the verification code sent to your email
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-center">
                  <Input
                    className="text-center text-lg tracking-wider w-48"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="000000"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
              <div className="text-center text-sm">
                <Link to="/forgot-password" className="text-primary hover:underline inline-flex items-center">
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Back to reset password
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default VerifyOTP;
