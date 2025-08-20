import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Utility function to create lazy-loaded components that handles both default and named exports
 * @param importFn - The dynamic import function
 * @param exportName - The name of the export (use 'default' for default exports)
 * @returns A lazy-loaded component
 */
export function createLazyComponent<T = any>(
  importFn: () => Promise<T>,
  exportName: string = 'default'
) {
  return importFn().then(module => {
    // Handle both default and named exports
    if (exportName === 'default') {
      // If the module has a default export, use it
      if ('default' in module && module.default) {
        return { default: module.default };
      }
      // If no default export, try to use the module itself
      return { default: module as any };
    } else {
      // For named exports, extract the specific export
      if (exportName in module) {
        return { default: (module as any)[exportName] };
      }
      // Fallback to module if export not found
      return { default: module as any };
    }
  });
}

/**
 * Helper function to create lazy components with better error handling
 * @param importFn - The dynamic import function
 * @param exportName - The name of the export
 * @returns A lazy-loaded component
 */
export function lazyImport<T = any>(
  importFn: () => Promise<T>,
  exportName: string = 'default'
) {
  return createLazyComponent(importFn, exportName);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function isValidFileSize(file: File, maxSizeMB: number): boolean {
  return file.size <= maxSizeMB * 1024 * 1024;
}
