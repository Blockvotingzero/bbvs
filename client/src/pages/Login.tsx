import { useCallback, useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Fingerprint, Phone, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  nin: z.string()
    .length(11, "NIN must be exactly 11 digits")
    .regex(/^\d+$/, "NIN must contain only numbers"),
  phone: z.string()
    .regex(/^\d{10,11}$/, "Phone number must be 10 or 11 digits")
    .optional()
    .or(z.literal(""))
});

type FormData = z.infer<typeof formSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nin: "",
      phone: ""
    }
  });

  const onSubmit = useCallback(async (data: FormData) => {
    try {
      setIsSubmitting(true);
      login(data.nin);
      const intendedPath = localStorage.getItem('intendedPath') || '/vote';
      localStorage.removeItem('intendedPath');

      if (data.phone) {
        setLocation("/otp");
      } else {
        setLocation("/liveness");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "Failed to login. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [setLocation, login, toast]);

  const phoneValue = form.watch("phone");

  return (
    <div className="container max-w-lg mx-auto px-4 py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Voter Authentication</CardTitle>
          <CardDescription>
            Please enter your NIN and optionally your phone number for verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>National Identification Number (NIN)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your 11-digit NIN" 
                        {...field}
                        maxLength={11}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your phone number" 
                        {...field}
                        maxLength={11}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={!phoneValue || isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Phone className="h-4 w-4" />
                  )}
                  {isSubmitting ? "Processing..." : "Proceed with OTP"}
                </Button>
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={!!phoneValue || isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Fingerprint className="h-4 w-4" />
                  )}
                  {isSubmitting ? "Processing..." : "Proceed with Liveness Check"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}