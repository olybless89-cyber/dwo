import { useState } from "react";
import { useListUsers } from "@workspace/api-client-react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getToken } from "@/lib/auth";
import { Send, Users, Mail, Loader2 } from "lucide-react";

const API = import.meta.env.VITE_API_URL ?? "";

async function apiFetch(path: string, body: object) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Request failed");
  return data;
}

export default function AdminEmail() {
  const { data: users } = useListUsers();
  const { toast } = useToast();

  const [singleUserId, setSingleUserId] = useState("");
  const [singleSubject, setSingleSubject] = useState("");
  const [singleBody, setSingleBody] = useState("");
  const [sendingSingle, setSendingSingle] = useState(false);

  const [bulkSubject, setBulkSubject] = useState("");
  const [bulkBody, setBulkBody] = useState("");
  const [sendingBulk, setSendingBulk] = useState(false);

  const handleSingleSend = async () => {
    if (!singleUserId || !singleSubject || !singleBody) {
      toast({ variant: "destructive", title: "Missing fields", description: "Select a user and fill in subject and message." });
      return;
    }
    setSendingSingle(true);
    try {
      await apiFetch("/admin/email/single", { userId: singleUserId, subject: singleSubject, body: singleBody });
      toast({ title: "Email Sent ✓", description: "Message delivered successfully." });
      setSingleSubject(""); setSingleBody(""); setSingleUserId("");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Send Failed", description: err.message });
    } finally {
      setSendingSingle(false);
    }
  };

  const handleBulkSend = async () => {
    if (!bulkSubject || !bulkBody) {
      toast({ variant: "destructive", title: "Missing fields", description: "Fill in subject and message." });
      return;
    }
    if (!window.confirm(`Send this email to all ${users?.length ?? "all"} users? This cannot be undone.`)) return;
    setSendingBulk(true);
    try {
      const result = await apiFetch("/admin/email/bulk", { subject: bulkSubject, body: bulkBody });
      toast({ title: "Bulk Email Sent ✓", description: `Sent: ${result.sent} · Failed: ${result.failed} · Total: ${result.total}` });
      setBulkSubject(""); setBulkBody("");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Bulk Send Failed", description: err.message });
    } finally {
      setSendingBulk(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">Email Center</h1>
          <p className="text-muted-foreground text-sm mt-1">Send messages to individual users or broadcast to all members</p>
        </div>
        <Tabs defaultValue="single">
          <TabsList className="mb-6">
            <TabsTrigger value="single" className="gap-2"><Mail className="h-4 w-4" /> Single Email</TabsTrigger>
            <TabsTrigger value="bulk" className="gap-2"><Users className="h-4 w-4" /> Bulk Email</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <Card className="border-border bg-card/60">
              <CardHeader className="pb-4"><CardTitle className="text-base font-semibold text-white">Send to One User</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">Recipient</Label>
                  <Select value={singleUserId} onValueChange={setSingleUserId}>
                    <SelectTrigger className="bg-background border-border text-white">
                      <SelectValue placeholder="Select a user…" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border max-h-64">
                      {users?.map((u) => (
                        <SelectItem key={u.id} value={u.id} className="text-white hover:bg-white/5">
                          {u.firstName} {u.lastName} — {u.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">Subject</Label>
                  <Input value={singleSubject} onChange={(e) => setSingleSubject(e.target.value)} placeholder="Email subject…" className="bg-background border-border text-white placeholder:text-muted-foreground/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">Message</Label>
                  <Textarea value={singleBody} onChange={(e) => setSingleBody(e.target.value)} placeholder="Write your message here…" rows={7} className="bg-background border-border text-white placeholder:text-muted-foreground/50 resize-none" />
                </div>
                <Button onClick={handleSingleSend} disabled={sendingSingle} className="w-full bg-primary hover:bg-primary/90 text-white font-semibold">
                  {sendingSingle ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending…</> : <><Send className="h-4 w-4 mr-2" /> Send Email</>}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk">
            <Card className="border-border bg-card/60">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-white">
                  Broadcast to All Users
                  {users && <span className="ml-2 text-xs font-normal text-muted-foreground">({users.length} recipients)</span>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-md bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-sm text-amber-400">
                  ⚠ This will send an email to <strong>every registered user</strong>. Double-check your message before sending.
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">Subject</Label>
                  <Input value={bulkSubject} onChange={(e) => setBulkSubject(e.target.value)} placeholder="Email subject…" className="bg-background border-border text-white placeholder:text-muted-foreground/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">Message</Label>
                  <Textarea value={bulkBody} onChange={(e) => setBulkBody(e.target.value)} placeholder="Write your broadcast message here…" rows={9} className="bg-background border-border text-white placeholder:text-muted-foreground/50 resize-none" />
                </div>
                <Button onClick={handleBulkSend} disabled={sendingBulk} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold">
                  {sendingBulk ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending to all users…</> : <><Send className="h-4 w-4 mr-2" /> Send to All {users?.length ?? ""} Users</>}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
