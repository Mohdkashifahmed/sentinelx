import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
}

export function getSeverityColor(severity: string): { bg: string; text: string; dot: string } {
  switch (severity.toLowerCase()) {
    case 'critical': return { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500' };
    case 'high': return { bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-700 dark:text-orange-400', dot: 'bg-orange-500' };
    case 'medium': return { bg: 'bg-yellow-50 dark:bg-yellow-950/30', text: 'text-yellow-700 dark:text-yellow-400', dot: 'bg-yellow-500' };
    case 'low': return { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' };
    default: return { bg: 'bg-gray-50 dark:bg-gray-950/30', text: 'text-gray-700 dark:text-gray-400', dot: 'bg-gray-500' };
  }
}

export function getRiskColor(risk: number): string {
  if (risk >= 80) return 'text-red-600 dark:text-red-400';
  if (risk >= 60) return 'text-orange-600 dark:text-orange-400';
  if (risk >= 40) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-green-600 dark:text-green-400';
}

export function getStatusColor(status: string): { bg: string; text: string } {
  switch (status.toLowerCase()) {
    case 'investigating': return { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-700 dark:text-blue-400' };
    case 'resolved': return { bg: 'bg-green-50 dark:bg-green-950/30', text: 'text-green-700 dark:text-green-400' };
    case 'open': return { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-700 dark:text-red-400' };
    case 'monitoring': return { bg: 'bg-purple-50 dark:bg-purple-950/30', text: 'text-purple-700 dark:text-purple-400' };
    case 'closed': return { bg: 'bg-gray-50 dark:bg-gray-950/30', text: 'text-gray-700 dark:text-gray-400' };
    default: return { bg: 'bg-gray-50 dark:bg-gray-950/30', text: 'text-gray-700 dark:text-gray-400' };
  }
}
