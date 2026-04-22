import { toast } from "sonner";

/**
 * Utility to export an array of objects to a CSV file.
 * @param data Array of objects to export
 * @param filename Name of the downloaded file (without .csv extension)
 */
export function exportToCSV<T extends Record<string, any>>(data: T[], filename: string) {
  if (!data || data.length === 0) {
    toast.error("No data available to export");
    return;
  }

  try {
    // Get headers from the first object
    const headers = Object.keys(data[0]);
    
    // Convert data to CSV format
    const csvRows = data.map(row => {
      return headers.map(header => {
        const value = row[header] === null || row[header] === undefined ? "" : row[header];
        // Escape quotes and wrap in quotes if value contains comma, newline, or quotes
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',');
    });

    // Combine headers and rows
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Export successful");
  } catch (error) {
    console.error("Export error:", error);
    toast.error("Failed to export data");
  }
}
