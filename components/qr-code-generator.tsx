"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface QRCode {
  id: string; // Changed from number to string
  url: string;
  name: string;
  created_at: string;
}

export function QrCodeGenerator() {
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    fetchQRCodes();
  }, []);

  const fetchQRCodes = async () => {
    try {
      const response = await fetch("/api/qr-codes");
      if (response.ok) {
        const data = await response.json();
        setQRCodes(data);
      } else {
        console.error("Failed to fetch QR codes");
      }
    } catch (error) {
      console.error("Error fetching QR codes:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (url && name) {
      try {
        const response = await fetch("/api/qr-codes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url, name }),
        });

        if (response.ok) {
          const newQRCode = await response.json();
          setQRCodes([newQRCode, ...qrCodes]);
          setUrl("");
          setName("");
        } else {
          console.error("Failed to create QR code");
        }
      } catch (error) {
        console.error("Error creating QR code:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">QR Code Generator</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My QR Code"
              required
            />
          </div>
          <Button type="submit">Generate QR Code</Button>
        </div>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>QR Code</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {qrCodes.map((qrCode) => (
            <TableRow key={qrCode.id}>
              <TableCell>{qrCode.name}</TableCell>
              <TableCell>{qrCode.url}</TableCell>
              <TableCell>
                <QRCodeSVG value={qrCode.url} size={100} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
