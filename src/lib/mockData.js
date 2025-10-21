export const mockData = {
  products: [
    { id: 1, name: "Premium Tempe Original", price: 25000, stock: 150, status: "active", category: "Original", sku: "TMP-001" },
    { id: 2, name: "Organic Tempe Special", price: 35000, stock: 85, status: "active", category: "Organic", sku: "TMP-002" },
    { id: 3, name: "Tempe Export Quality", price: 45000, stock: 200, status: "active", category: "Export", sku: "TMP-003" },
    { id: 4, name: "Tempe Kacang Hijau", price: 30000, stock: 60, status: "inactive", category: "Special", sku: "TMP-004" },
  ],
  orders: [
    { id: 1, customer: "John Doe", email: "john@example.com", total: 125000, status: "pending", date: "2025-01-15", items: 5 },
    { id: 2, customer: "Jane Smith", email: "jane@example.com", total: 275000, status: "shipped", date: "2025-01-14", items: 8 },
    { id: 3, customer: "Bob Johnson", email: "bob@example.com", total: 95000, status: "done", date: "2025-01-13", items: 3 },
    { id: 4, customer: "Alice Brown", email: "alice@example.com", total: 180000, status: "paid", date: "2025-01-12", items: 6 },
  ],
  affiliates: [
    { id: 1, name: "Sarah Wilson", email: "sarah@affiliate.com", orders: 15, commission: 750000, rank: 1, goal: 20, status: "active", joinDate: "2024-12-01" },
    { id: 2, name: "Mike Chen", email: "mike@affiliate.com", orders: 12, commission: 600000, rank: 2, goal: 15, status: "active", joinDate: "2024-11-15" },
    { id: 3, name: "Lisa Park", email: "lisa@affiliate.com", orders: 8, commission: 400000, rank: 3, goal: 10, status: "pending", joinDate: "2025-01-10" },
    { id: 4, name: "David Kim", email: "david@affiliate.com", orders: 5, commission: 250000, rank: 4, goal: 8, status: "active", joinDate: "2024-10-20" },
  ],
};
