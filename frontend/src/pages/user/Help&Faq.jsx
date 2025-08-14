import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MessageCircle,
  Users,
  Bot,
  FileText,
  AlertTriangle,
  Clock,
  MapPin,
  BarChart3,
} from "lucide-react";

export default function HelpFaq() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Help & FAQ
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get help with Civic Pulse - your smart civic complaint management
            system
          </p>
        </div>

        {/* Quick Start Guide */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Quick Start Guide
            </CardTitle>
            <CardDescription>
              New to Civic Pulse? Here's how to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-600" />
                  For Citizens
                </h3>
                <ol className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">
                      1
                    </Badge>
                    <span>Submit text-based complaints with details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">
                      2
                    </Badge>
                    <span>
                      AI automatically classifies priority (High/Medium/Low)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">
                      3
                    </Badge>
                    <span>Track status: Pending → Assigned → Resolved</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">
                      4
                    </Badge>
                    <span>Confirm resolution to help close complaints</span>
                  </li>
                </ol>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Bot className="h-4 w-4 text-purple-600" />
                  For Government Staff
                </h3>
                <ol className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">
                      1
                    </Badge>
                    <span>View and filter complaints by priority level</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">
                      2
                    </Badge>
                    <span>Get AI-suggested department contacts/emails</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">
                      3
                    </Badge>
                    <span>Mark complaints as assigned or resolved</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">
                      4
                    </Badge>
                    <span>Automatic escalation for unresolved issues</span>
                  </li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Sections */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            {/* General Questions */}
            <AccordionItem
              value="general"
              className="bg-white dark:bg-gray-800 rounded-lg px-6"
            >
              <AccordionTrigger className="text-lg font-semibold cursor-pointer">
                General Questions
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">What is Civic Pulse?</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Civic Pulse is a smart civic complaint management system
                    where citizens can raise issues, AI classifies and routes
                    them to the correct department, and government staff can
                    track, resolve, and escalate issues with automation.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">
                    What types of issues can I report?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    You can report various civic issues including road
                    maintenance, water problems, waste management, public safety
                    concerns, infrastructure issues, and more through text-based
                    complaints.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">
                    Do I need to be signed in to access help?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Yes, this help and FAQ section is only visible to signed-in
                    users. Please log in to access the full complaint management
                    features.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Citizen Features */}
            <AccordionItem
              value="citizen-features"
              className="bg-white dark:bg-gray-800 rounded-lg px-6"
            >
              <AccordionTrigger className="text-lg font-semibold cursor-pointer">
                Citizen Features
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">
                    How do I submit a complaint?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Simply write a text-based description of your issue. Our AI
                    will automatically analyze and classify your complaint's
                    priority level and route it to the appropriate department.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">
                    How does AI priority classification work?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    Our AI using Gemini/OpenAI APIs automatically classifies
                    complaints into three priority levels:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-500">High Priority</Badge>
                      <span className="text-sm">
                        Urgent issues requiring immediate attention
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-500">Medium Priority</Badge>
                      <span className="text-sm">
                        Important issues needing timely resolution
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">Low Priority</Badge>
                      <span className="text-sm">
                        Standard issues with normal processing time
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">
                    What complaint statuses can I track?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    Your complaints progress through these stages:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Pending</Badge>
                      <span className="text-sm">
                        Complaint submitted and awaiting assignment
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Assigned</Badge>
                      <span className="text-sm">
                        Department staff is working on the issue
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">Resolved</Badge>
                      <span className="text-sm">
                        Issue has been fixed by the department
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-orange-500">Escalated</Badge>
                      <span className="text-sm">
                        Issue escalated to higher authorities
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">
                    Why do I need to confirm resolution?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Confirming resolution helps close complaints and provides
                    feedback to departments about their work quality. If you
                    don't confirm within the time limit, the complaint may be
                    auto-removed from the system.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Government Staff Features */}
            <AccordionItem
              value="staff-features"
              className="bg-white dark:bg-gray-800 rounded-lg px-6"
            >
              <AccordionTrigger className="text-lg font-semibold cursor-pointer">
                Government Staff Features
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">
                    How do I view and filter complaints?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Access your department dashboard to view all assigned
                    complaints. Use filters to sort by priority level (High,
                    Medium, Low) or status to focus on the most urgent issues
                    first.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">
                    What are AI-suggested contacts?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    When you click on a complaint, our AI provides suggested
                    contact information and email addresses for the most
                    relevant department or personnel who should handle that
                    specific type of issue.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">
                    How do I update complaint status?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Simply click on a complaint and use the status update
                    buttons to mark it as "Assigned" when you start working on
                    it, or "Resolved" when the issue is fixed. Citizens receive
                    automatic notifications of status changes.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">
                    How does automatic escalation work?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    The system automatically escalates unresolved complaints
                    based on priority levels and time limits. You'll receive
                    notifications when complaints are approaching escalation
                    deadlines.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* AI & Automation */}
            <AccordionItem
              value="ai-automation"
              className="bg-white dark:bg-gray-800 rounded-lg px-6"
            >
              <AccordionTrigger className="text-lg font-semibold cursor-pointer">
                AI & Automation Features
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">
                    How does department mapping work?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Our AI analyzes complaint text using prompt-engineered LLM
                    calls to automatically determine which government department
                    should handle each issue, ensuring faster routing and
                    response times.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">
                    What is the Auto-Escalation Engine?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    A background job system that automatically escalates
                    complaints based on priority and time elapsed:
                  </p>
                  <div className="space-y-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-red-500" />
                      <Badge className="bg-red-500">High Priority</Badge>
                      <span className="text-sm">→ escalate after 1 day</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <Badge className="bg-yellow-500">Medium Priority</Badge>
                      <span className="text-sm">→ escalate after 3 days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-500" />
                      <Badge className="bg-green-500">Low Priority</Badge>
                      <span className="text-sm">→ escalate after 5 days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <Badge variant="outline">Resolved (unconfirmed)</Badge>
                      <span className="text-sm">
                        → auto-remove after 3 days
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">
                    How often does the system check for escalations?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    The auto-escalation system runs via a CRON job or backend
                    scheduler, checking complaint deadlines multiple times per
                    day to ensure timely escalations.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Future Enhancements */}
            <AccordionItem
              value="future"
              className="bg-white dark:bg-gray-800 rounded-lg px-6"
            >
              <AccordionTrigger className="text-lg font-semibold cursor-pointer">
                Upcoming Features
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-500" />
                    Admin Analytics Dashboard
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Coming soon: Comprehensive analytics dashboard with charts
                    showing complaint trends, resolution times, department
                    performance, and citizen satisfaction metrics.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-green-500" />
                    Enhanced Notification System
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Planned: Email and SMS notifications for real-time updates
                    on complaint status changes, escalations, and resolution
                    confirmations.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-red-500" />
                    Location Tagging
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    In development: Google Maps integration for precise location
                    tagging of complaints, helping departments locate and
                    resolve issues more efficiently.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Technical Support */}
            <AccordionItem
              value="technical"
              className="bg-white dark:bg-gray-800 rounded-lg px-6"
            >
              <AccordionTrigger className="text-lg font-semibold cursor-pointer">
                Technical Support
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">
                    The website isn't loading properly. What should I do?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Try refreshing the page, clearing your browser cache, or
                    using a different browser. If issues persist, contact our
                    technical support team.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">
                    I forgot my password. How can I reset it?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Click "Forgot Password" on the login page and enter your
                    email address. You'll receive a password reset link within a
                    few minutes.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">
                    Is my personal information secure?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Yes, we use industry-standard encryption and security
                    measures to protect your data. Your information is only
                    shared with relevant government departments for complaint
                    resolution.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Contact Support */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              Still Need Help?
            </CardTitle>
            <CardDescription>
              Can't find what you're looking for? Our support team is here to
              help.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
              >
                <Mail className="h-6 w-6 text-blue-600" />
                <div className="text-center">
                  <div className="font-medium">Email Support</div>
                  <div className="text-sm text-gray-500">
                    support@citymunicipality.gov
                  </div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
              >
                <Phone className="h-6 w-6 text-green-600" />
                <div className="text-center">
                  <div className="font-medium">Phone Support</div>
                  <div className="text-sm text-gray-500">
                    +91 (555) 123-4567
                  </div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
              >
                <MapPin className="h-6 w-6 text-purple-600" />
                <div className="text-center">
                  <div className="font-medium">Visit Us</div>
                  <div className="text-sm text-gray-500">
                    Municipal Corporation Building
                  </div>
                </div>
              </Button>
            </div>

            <div className="mt-6 p-4 bg-red-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-700 dark:text-blue-100">
                    Emergency Issues
                  </h4>
                  <p className="text-sm text-red-700 dark:text-blue-200">
                    For urgent matters, call our 24/7 helpline: +91 (555)
                    999-8888
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
