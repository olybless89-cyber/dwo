import { useState } from "react";
import { useListUsers } from "@workspace/api-client-react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Users, Mail, Search, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken } from "@/lib/auth";

// ── API helpers ───────────────────────────────────────────────────────────────
// Use the same env var as the rest of the app; backend mounts routes at /api
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";

async function apiFetch(path: string, opts?: RequestInit) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts?.headers ?? {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message ?? `Request failed (${res.status})`);
  return data;
}

function useEmailLogs() {
  return useQuery({
    queryKey: ["admin", "email-logs"],
    queryFn: () => apiFetch("/messages"),
    refetchInterval: 30_000,
  });
}

function useSendSingle() {
  return useMutation({
    mutationFn: (body: { userId: string; subject: string; body: string }) =>
      apiFetch("/messages/send", { method: "POST", body: JSON.stringify(body) }),
  });
}

function useSendBulk() {
  return useMutation({
    mutationFn: (body: { subject: string; body: string }) =>
      apiFetch("/messages/send-bulk", { method: "POST", body: JSON.stringify(body) }),
  });
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AdminMessages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: users = [] } = useListUsers();
  const { data: logs = [], isLoading: logsLoading } = useEmailLogs();

  // Single email state
  const [userSearch, setUserSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [singleSubject, setSingleSubject] = useState("");
  const [singleBody, setSingleBody] = useState("");

  // Bulk email state
  const [bulkSubject, setBulkSubject] = useState("");
  const [bulkBody, setBulkBody] = useState("");

  const sendSingle = useSendSingle();
  const sendBulk = useSendBulk();

  const filteredUsers = users.filter((u: any) => {
    const q = userSearch.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q)
    );
  });

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setUserSearch(`${user.firstName} ${user.lastName} <${user.email}>`);
    setShowDropdown(false);
  };

  const handleSendSingle = () => {
    if (!selectedUser) return toast({ title: "Select a recipient", variant: "destructive" });
    if (!singleSubject.trim()) return toast({ title: "Subject is required", variant: "destructive" });
    if (!singleBody.trim()) return toast({ title: "Message body is required", variant: "destructive" });

    sendSingle.mutate(
      { userId: selectedUser.id, subject: singleSubject, body: singleBody },
      {
        onSuccess: (res) => {
          toast({ title: "Email sent", description: res.message });
          setSingleSubject("");
          setSingleBody("");
          setSelectedUser(null);
          setUserSearch("");
          queryClient.invalidateQueries({ queryKey: ["admin", "email-logs"] });
        },
        onError: (err: any) => toast({ title: "Failed to send", description: err.message, variant: "destructive" }),
      },
    );
  };

  const handleSendBulk = () => {
    if (!bulkSubject.trim()) return toast({ title: "Subject is required", variant: "destructive" });
    if (!bulkBody.trim()) return toast({ title: "Message body is required", variant: "destructive" });

    sendBulk.mutate(
      { subject: bulkSubject, body: bulkBody },
      {
        onSuccess: (res) => {
          toast({ title: "Bulk email sent", description: res.message });
          setBulkSubject("");
          setBulkBody("");
          queryClient.invalidateQueries({ queryKey: ["admin", "email-logs"] });
        },
        onError: (err: any) => toast({ title: "Failed to send", description: err.message, variant: "destructive" }),
      },
    );
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-light tracking-tight mb-2 text-white">Messages</h1>
          <p className="text-muted-foreground">Send emails to individual members or broadcast to all users.</p>
        </div>

        <Tabs defaultValue="single">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="single" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Mail className="h-4 w-4 mr-2" />
              Single User
            </TabsTrigger>
            <TabsTrigger value="bulk" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Bulk Email
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              History
            </TabsTrigger>
          </TabsList>

          {/* ── Single User Tab ── */}
          <TabsContent value="single" className="mt-6">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg font-medium">Send to a Single User</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* User search */}
                <div className="space-y-2 relative">
                  <Label className="text-muted-foreground uppercase text-xs tracking-wider">Recipient</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email…"
                      value={userSearch}
                      onChange={(e) => {
                        setUserSearch(e.target.value);
                        setSelectedUser(null);
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      className="pl-9 bg-black/20 border-white/10 h-11 rounded-sm focus-visible:ring-primary text-white"
                    />
                  </div>
                  {showDropdown && userSearch && !selectedUser && (
                    <div className="absolute z-50 w-full top-full mt-1 bg-card border border-white/10 rounded-md shadow-xl overflow-hidden max-h-56 overflow-y-auto">
                      {filteredUsers.length === 0 ? (
                        <div className="p-3 text-sm text-muted-foreground text-center">No users found</div>
                      ) : (
                        filteredUsers.slice(0, 20).map((u: any) => (
                          <button
                            key={u.id}
                            type="button"
                            className="w-full text-left px-4 py-2.5 hover:bg-white/5 transition-colors"
                            onClick={() => handleSelectUser(u)}
                          >
                            <div className="text-white text-sm font-medium">{u.firstName} {u.lastName}</div>
                            <div className="text-muted-foreground text-xs">{u.email}</div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label className="text-muted-foreground uppercase text-xs tracking-wider">Subject</Label>
                  <Input
                    placeholder="Email subject…"
                    value={singleSubject}
                    onChange={(e) => setSingleSubject(e.target.value)}
                    className="bg-black/20 border-white/10 h-11 rounded-sm focus-visible:ring-primary text-white"
                  />
                </div>

                {/* Body */}
                <div className="space-y-2">
                  <Label className="text-muted-foreground uppercase text-xs tracking-wider">Message</Label>
                  <Textarea
                    placeholder="Write your message here…"
                    value={singleBody}
                    onChange={(e) => setSingleBody(e.target.value)}
                    rows={8}
                    className="bg-black/20 border-white/10 rounded-sm focus-visible:ring-primary text-white resize-none"
                  />
                </div>

                <Button
                  onClick={handleSendSingle}
                  disabled={sendSingle.isPending}
                  className="bg-primary hover:bg-primary/90 text-white tracking-wide uppercase font-medium rounded-sm h-11 px-8"
                >
                  {sendSingle.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send Email
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Bulk Email Tab ── */}
          <TabsContent value="bulk" className="mt-6">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg font-medium">
                  Send to All Users
                  <span className="ml-3 text-sm font-normal text-muted-foreground">
                    ({users.length} registered users)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-4 text-sm text-yellow-400">
                  This will send an email to <strong>all {users.length} registered users</strong>. Please review your message carefully before sending.
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground uppercase text-xs tracking-wider">Subject</Label>
                  <Input
                    placeholder="Email subject…"
                    value={bulkSubject}
                    onChange={(e) => setBulkSubject(e.target.value)}
                    className="bg-black/20 border-white/10 h-11 rounded-sm focus-visible:ring-primary text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground uppercase text-xs tracking-wider">Message</Label>
                  <Textarea
                    placeholder="Write your message here…"
                    value={bulkBody}
                    onChange={(e) => setBulkBody(e.target.value)}
                    rows={8}
                    className="bg-black/20 border-white/10 rounded-sm focus-visible:ring-primary text-white resize-none"
                  />
                </div>

                <Button
                  onClick={handleSendBulk}
                  disabled={sendBulk.isPending}
                  className="bg-primary hover:bg-primary/90 text-white tracking-wide uppercase font-medium rounded-sm h-11 px-8"
                >
                  {sendBulk.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Users className="h-4 w-4 mr-2" />
                  )}
                  Send to All Users
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── History Tab ── */}
          <TabsContent value="history" className="mt-6">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg font-medium">Email History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/5 hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Recipient</TableHead>
                        <TableHead className="text-muted-foreground">Subject</TableHead>
                        <TableHead className="text-muted-foreground">Type</TableHead>
                        <TableHead className="text-muted-foreground">Date Sent</TableHead>
                        <TableHead className="text-muted-foreground">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logsLoading && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center p-8">
                            <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                          </TableCell>
                        </TableRow>
                      )}
                      {!logsLoading && logs.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center p-10 text-muted-foreground">
                            No emails sent yet.
                          </TableCell>
                        </TableRow>
                      )}
                      {logs.map((log: any) => (
                        <TableRow key={log.id} className="border-white/5 hover:bg-white/[0.02]">
                          <TableCell>
                            {log.recipientType === "bulk" ? (
                              <div>
                                <div className="text-white font-medium text-sm">All Users</div>
                                <div className="text-xs text-muted-foreground">{log.sentCount} recipients</div>
                              </div>
                            ) : (
                              <div>
                                <div className="text-white font-medium text-sm">{log.recipientName}</div>
                                <div className="text-xs text-muted-foreground">{log.recipientEmail}</div>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-white text-sm max-w-xs truncate">{log.subject}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-white/10 text-muted-foreground text-xs capitalize">
                              {log.recipientType}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                            {format(new Date(log.sentAt), "MMM dd, yyyy HH:mm")}
                          </TableCell>
                          <TableCell>
                            {log.status === "sent" ? (
                              <span className="flex items-center gap-1.5 text-emerald-400 text-sm">
                                <CheckCircle2 className="h-4 w-4" /> Sent
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-red-400 text-sm">
                                <XCircle className="h-4 w-4" /> Failed
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
