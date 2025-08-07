import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export default function SettingsPage() {
    const [twoFA, setTwoFA] = useState(false);

    return (

        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <div className="max-w-4xl mx-auto space-y-6 py-10 px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-semibold text-gray-800">Account Settings</h2>

                {/* Profile Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                    <h3 className="text-lg font-medium">Profile</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Full Name</Label>
                            <Input placeholder="John Doe" />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input placeholder="john@example.com" />
                        </div>
                        <div>
                            <Label>Phone</Label>
                            <Input placeholder="+1234567890" />
                        </div>
                        <div>
                            <Label>Profile Picture</Label>
                            <Input type="file" />
                        </div>
                    </div>
                </div>

                {/* Notification Preferences */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="email-notifications" />
                            <Label htmlFor="email-notifications">Email Notifications</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="sms-notifications" />
                            <Label htmlFor="sms-notifications">SMS Notifications</Label>
                        </div>
                    </div>
                </div>

                {/* Linked Social Accounts */}
                <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                    <h3 className="text-lg font-medium">Linked Social Accounts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Twitter</Label>
                            <Input placeholder="@username" />
                        </div>
                        <div>
                            <Label>Instagram</Label>
                            <Input placeholder="@insta" />
                        </div>
                        <div>
                            <Label>Facebook</Label>
                            <Input defaultValue="facebook.com/johndoe" />
                        </div>
                        <div>
                            <Label>LinkedIn</Label>
                            <Input placeholder="linkedin.com/in/..." />
                        </div>
                    </div>
                </div>


                {/* Security */}
                <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                    <h3 className="text-lg font-medium">Security</h3>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="2fa" checked={twoFA} onCheckedChange={() => setTwoFA(!twoFA)} />
                        <Label htmlFor="2fa">Enable Two-Factor Authentication (2FA)</Label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <Label>Change Password</Label>
                            <Input type="password" placeholder="********" />
                        </div>
                        <div className="flex items-end">
                            <Button>Change Password</Button>
                        </div>
                    </div>
                </div>

                {/* Government ID Verification */}
                <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                    <h3 className="text-lg font-medium">Government ID Verification</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>ID Type</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select ID Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cnic">CNIC</SelectItem>
                                    <SelectItem value="passport">Passport</SelectItem>
                                    <SelectItem value="driver_license">Driver's License</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Upload Document</Label>
                            <Input type="file" />
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <Button className="bg-emerald-700 hover:bg-emerald-800">Save Changes</Button>
                </div>
            </div>
        </div>
    );
}
