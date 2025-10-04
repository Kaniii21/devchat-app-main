"use client"

import type * as React from "react"
import { BarChart as RechartsBarChart } from "recharts"
import { LineChart as RechartsLineChart } from "recharts"
import { PieChart as RechartsPieChart } from "recharts"
import {
  Bar,
  Line,
  Pie,
  Cell,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts"

import { cn } from "@/lib/utils"

// Re-export Recharts components
export { Bar, Line, Pie, Cell, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer }

// Define chart components with default styling
export function BarChart({
  data,
  className,
  options,
  ...props
}: React.ComponentProps<typeof RechartsBarChart> & {
  options?: any
}) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={cn(className)}>
      <RechartsBarChart data={data} {...props}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<ChartTooltip />} />
        <Legend />
        {props.children}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

export function LineChart({
  data,
  className,
  options,
  ...props
}: React.ComponentProps<typeof RechartsLineChart> & {
  options?: any
}) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={cn(className)}>
      <RechartsLineChart data={data} {...props}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<ChartTooltip />} />
        <Legend />
        {props.children}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

export function PieChart({
  data,
  className,
  options,
  ...props
}: React.ComponentProps<typeof RechartsPieChart> & {
  options?: any
}) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={cn(className)}>
      <RechartsPieChart {...props}>
        <Tooltip content={<ChartTooltip />} />
        <Legend />
        <Pie data={data} {...(options?.pie || {})} />
        {props.children}
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

// Custom tooltip component
export function ChartTooltip({ active, payload, label, ...props }: TooltipProps<any, any>) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
          <span className="font-bold text-muted-foreground">{payload[0].value}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">{payload[0].name}</span>
          <span className="font-bold" style={{ color: payload[0].color || "currentColor" }}>
            {payload[0].value}
          </span>
        </div>
      </div>
    </div>
  )
}
