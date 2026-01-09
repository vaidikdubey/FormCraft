import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignupSchema } from '@/lib/zod'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/useAuthStore'
import { Link } from 'react-router-dom'
import { Eye, EyeClosed } from 'lucide-react'

//Shadcn components
import { Button } from '@/components/ui/button'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const RegisterPage = () => {
  return (
    <div>RegisterPage</div>
  )
}
