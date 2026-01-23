"use client";

import React, { useState } from "react";
import { Card } from "@/app/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

export default function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState("products");

  const products = [
    {
      id: "P001",
      name: "Premium Wireless Headphones",
      category: "Electronics",
      price: "$149.99",
      warranty: "2 years",
    },
    {
      id: "P002",
      name: "USB-C Fast Charging Cable",
      category: "Accessories",
      price: "$29.99",
      warranty: "1 year",
    },
    {
      id: "P003",
      name: "Portable Power Bank 20000mAh",
      category: "Electronics",
      price: "$59.99",
      warranty: "18 months",
    },
    {
      id: "P004",
      name: "Wireless Mouse",
      category: "Accessories",
      price: "$39.99",
      warranty: "1 year",
    },
    {
      id: "P005",
      name: "Mechanical Keyboard RGB",
      category: "Electronics",
      price: "$119.99",
      warranty: "2 years",
    },
  ];

  const orders = [
    {
      id: "ORD-001",
      customer: "John Smith",
      product: "Premium Wireless Headphones",
      quantity: 1,
      status: "Delivered",
      date: "2024-01-15",
    },
    {
      id: "ORD-002",
      customer: "Jane Doe",
      product: "USB-C Fast Charging Cable",
      quantity: 3,
      status: "Processing",
      date: "2024-01-20",
    },
    {
      id: "ORD-003",
      customer: "Mike Johnson",
      product: "Portable Power Bank 20000mAh",
      quantity: 1,
      status: "Shipped",
      date: "2024-01-18",
    },
    {
      id: "ORD-004",
      customer: "Sarah Williams",
      product: "Wireless Mouse",
      quantity: 2,
      status: "Delivered",
      date: "2024-01-10",
    },
    {
      id: "ORD-005",
      customer: "Tom Brown",
      product: "Mechanical Keyboard RGB",
      quantity: 1,
      status: "Processing",
      date: "2024-01-21",
    },
  ];

  const policies = [
    {
      id: "POL-001",
      name: "Return Policy",
      description: "Items can be returned within 30 days of purchase",
      condition: "Original condition with receipt",
      processing: "5-7 business days",
    },
    {
      id: "POL-002",
      name: "Warranty Policy",
      description: "All products covered under manufacturer warranty",
      condition: "Not damaged by customer",
      processing: "10-14 business days",
    },
    {
      id: "POL-003",
      name: "Order Modification Policy",
      description: "Orders can be modified within 1 hour of placement",
      condition: "Before order processing",
      processing: "Immediate",
    },
    {
      id: "POL-004",
      name: "Shipping Policy",
      description: "Free shipping on orders over $50",
      condition: "Domestic orders only",
      processing: "2-5 business days",
    },
    {
      id: "POL-005",
      name: "Price Match Policy",
      description: "We match competitor prices on identical items",
      condition: "Must provide competitor quote",
      processing: "24 hours",
    },
  ];

  const TableContainer = ({ children }: { children: React.ReactNode }) => (
    <Card className="bg-card border-border shadow-md overflow-hidden">
      {children}
    </Card>
  );

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background to-background/80 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-primary mb-3">
            Knowledge Base
          </h2>
          <p className="text-lg text-muted-foreground">
            Read-only structured data repository
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-secondary/10 border border-border">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <TableContainer>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-secondary/10 border-b border-border">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-primary font-bold">
                        Product ID
                      </TableHead>
                      <TableHead className="text-primary font-bold">
                        Product Name
                      </TableHead>
                      <TableHead className="text-primary font-bold">
                        Category
                      </TableHead>
                      <TableHead className="text-primary font-bold">
                        Price
                      </TableHead>
                      <TableHead className="text-primary font-bold">
                        Warranty
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow
                        key={product.id}
                        className="border-b border-border hover:bg-accent/5"
                      >
                        <TableCell className="font-mono text-sm text-foreground">
                          {product.id}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {product.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {product.category}
                        </TableCell>
                        <TableCell className="text-foreground font-semibold">
                          {product.price}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {product.warranty}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TableContainer>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <TableContainer>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-secondary/10 border-b border-border">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-primary font-bold">
                        Order ID
                      </TableHead>
                      <TableHead className="text-primary font-bold">
                        Customer
                      </TableHead>
                      <TableHead className="text-primary font-bold">
                        Product
                      </TableHead>
                      <TableHead className="text-primary font-bold">
                        Qty
                      </TableHead>
                      <TableHead className="text-primary font-bold">
                        Status
                      </TableHead>
                      <TableHead className="text-primary font-bold">
                        Date
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="border-b border-border hover:bg-accent/5"
                      >
                        <TableCell className="font-mono text-sm text-foreground">
                          {order.id}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {order.customer}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {order.product}
                        </TableCell>
                        <TableCell className="text-foreground text-center">
                          {order.quantity}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === "Delivered"
                                ? "bg-accent/20 text-accent"
                                : order.status === "Shipped"
                                  ? "bg-primary/20 text-primary"
                                  : "bg-secondary/20 text-secondary"
                            }`}
                          >
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {order.date}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TableContainer>
          </TabsContent>

          <TabsContent value="policies" className="mt-6">
            <div className="space-y-4">
              {policies.map((policy) => (
                <Card
                  key={policy.id}
                  className="p-6 bg-card border-border shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold">
                          {policy.id}
                        </span>
                        <h4 className="text-lg font-bold text-primary">
                          {policy.name}
                        </h4>
                      </div>
                      <p className="text-foreground">{policy.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-xs font-semibold text-secondary uppercase mb-1">
                        Conditions
                      </p>
                      <p className="text-sm text-foreground">
                        {policy.condition}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-secondary uppercase mb-1">
                        Processing
                      </p>
                      <p className="text-sm text-foreground">
                        {policy.processing}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
