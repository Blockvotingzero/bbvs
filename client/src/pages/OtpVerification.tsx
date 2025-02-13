
import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must contain only numbers")
});

export default function OtpVerification() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [otpAttempts, setOtpAttempts] = useState(0);
  
  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: ""
    }
  });

  const verifyOtp = (data: z.infer<typeof otpSchema>) => {
    if (data.otp === "123456") {
      toast({
        title: "Verification successful",
        description: "You can now proceed to vote"
      });
      setLocation("/vote");
      return;
    }

    const newAttempts = otpAttempts + 1;
    setOtpAttempts(newAttempts);

    if (newAttempts >= 3) {
      toast({
        title: "Too many failed attempts",
        description: "Redirecting to facial verification...",
        variant: "destructive"
      });
      setTimeout(() => setLocation("/facial-verification"), 2000);
    } else {
      toast({
        title: "Invalid OTP",
        description: `Incorrect code, please try again. ${3 - newAttempts} ${newAttempts === 2 ? 'attempt' : 'attempts'} remaining.`,
        variant: "destructive"
      });
      form.reset();
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Enter OTP</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(verifyOtp)} className="space-y-4">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                          field.onChange(value);
                        }}
                        maxLength={6}
                        placeholder="Enter 6-digit code"
                        className="text-center tracking-widest"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                Verify OTP
              </Button>
              <div className="text-center">
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm"
                  onClick={() => setLocation("/vote")}
                  type="button"
                >
                  Back to verification
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
