import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Key,
  Activity,
  Settings,
  Save,
  Edit,
  Eye,
  EyeOff,
  Clock,
  CheckCircle,
  AlertTriangle,
  Lock
} from "lucide-react";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  title: z.string().optional(),
  department: z.string().optional(),
  bio: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

function ProfileInformation() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      title: user?.title || "",
      department: user?.department || "",
      bio: user?.bio || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileForm) => apiRequest("/api/auth/profile", "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({ title: "Success", description: "Profile updated successfully" });
      setIsEditing(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    }
  });

  const handleSaveProfile = (data: ProfileForm) => {
    updateProfileMutation.mutate(data);
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your personal information and account details</CardDescription>
            </div>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSaveProfile)} className="space-y-6">
            {/* Profile Picture and Basic Info */}
            <div className="flex items-start gap-6">
              <div className="flex flex-col items-center gap-3">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user?.profileImageUrl || ""} />
                  <AvatarFallback className="text-lg">
                    {getInitials(user?.firstName, user?.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                  <Badge className="mt-1" variant="secondary">
                    {user?.role}
                  </Badge>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...form.register("firstName")}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...form.register("lastName")}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.lastName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    {...form.register("phone")}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    {...form.register("title")}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                    placeholder="Data Engineer"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    {...form.register("department")}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                    placeholder="Engineering"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...form.register("bio")}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <Button type="submit" disabled={updateProfileMutation.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">User ID</Label>
                <p className="text-sm text-gray-600 font-mono">{user?.id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Account Status</Label>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {user?.status || 'Active'}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium">Member Since</Label>
                <p className="text-sm text-gray-600">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Role</Label>
                <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Last Login</Label>
                <p className="text-sm text-gray-600">
                  {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Email Verified</Label>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SecuritySettings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: PasswordForm) => apiRequest("/api/auth/change-password", "POST", data),
    onSuccess: () => {
      toast({ title: "Success", description: "Password changed successfully" });
      form.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to change password", variant: "destructive" });
    }
  });

  const handleChangePassword = (data: PasswordForm) => {
    changePasswordMutation.mutate(data);
  };

  const securityEvents = [
    {
      id: 1,
      event: "Password changed",
      timestamp: "2025-01-02T10:30:00Z",
      ipAddress: "192.168.1.100",
      location: "New York, USA",
      status: "success"
    },
    {
      id: 2,
      event: "Login attempt",
      timestamp: "2025-01-02T09:15:00Z",
      ipAddress: "192.168.1.100",
      location: "New York, USA",
      status: "success"
    },
    {
      id: 3,
      event: "Failed login attempt",
      timestamp: "2025-01-01T22:45:00Z",
      ipAddress: "203.0.113.0",
      location: "Unknown",
      status: "failed"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleChangePassword)} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  {...form.register("currentPassword")}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.formState.errors.currentPassword && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.currentPassword.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  {...form.register("newPassword")}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.formState.errors.newPassword && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.newPassword.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...form.register("confirmPassword")}
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" disabled={changePasswordMutation.isPending}>
              <Lock className="w-4 h-4 mr-2" />
              {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Activity</CardTitle>
          <CardDescription>Monitor recent logins and security events</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {securityEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.event}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{event.ipAddress}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>
                    <Badge className={event.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {event.status === 'success' ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 mr-1" />
                      )}
                      {event.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ActivityLog() {
  const activityLog = [
    {
      id: 1,
      action: "Viewed dashboard",
      details: "Accessed main dashboard",
      timestamp: "2025-01-02T14:30:00Z",
      ipAddress: "192.168.1.100"
    },
    {
      id: 2,
      action: "Updated profile",
      details: "Changed profile information",
      timestamp: "2025-01-02T13:15:00Z",
      ipAddress: "192.168.1.100"
    },
    {
      id: 3,
      action: "Created pipeline",
      details: "Created new data pipeline 'Customer Analytics'",
      timestamp: "2025-01-02T10:45:00Z",
      ipAddress: "192.168.1.100"
    },
    {
      id: 4,
      action: "Logged in",
      details: "Successful login to account",
      timestamp: "2025-01-02T09:30:00Z",
      ipAddress: "192.168.1.100"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>Your recent account activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityLog.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
              <Activity className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
                <p className="text-sm text-gray-600">{activity.details}</p>
                <p className="text-xs text-gray-500 mt-1">IP: {activity.ipAddress}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileInformation />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityLog />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}