"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, CoinsIcon, Clock, Zap, Target, FileText, Database, Globe, MousePointer, Navigation, Scroll, Sparkles, Plus } from "lucide-react";
import { TaskType } from "@/lib/types";
import { TaskRegistry } from "@/lib/workflow/task/Registry";

interface TaskDescriptionSidebarProps {
  taskType: TaskType | null;
  isOpen: boolean;
  onClose: () => void;
}

function TaskDescriptionSidebar({ taskType, isOpen, onClose }: TaskDescriptionSidebarProps) {
  if (!taskType || !isOpen) return null;

  const task = TaskRegistry[taskType];

  const getTaskIcon = (type: TaskType) => {
    const iconProps = { size: 20, className: "text-white drop-shadow-sm" };
    
    switch (type) {
      case TaskType.PAGE_TO_HTML:
        return <Globe {...iconProps} />;
      case TaskType.FILL_INPUT:
        return <FileText {...iconProps} />;
      case TaskType.CLICK_ELEMENT:
        return <MousePointer {...iconProps} />;
      case TaskType.EXTRACT_TEXT_FROM_ELEMENT:
        return <FileText {...iconProps} />;
      case TaskType.EXTRACT_DATA_WITH_AI:
        return <Sparkles {...iconProps} />;
      case TaskType.READ_PROPERTY_FROM_JSON:
        return <Database {...iconProps} />;
      case TaskType.ADD_PROPERTY_TO_JSON:
        return <Plus {...iconProps} />;
      case TaskType.NAVIGATE_URL:
        return <Navigation {...iconProps} />;
      case TaskType.SCROLL_TO_ELEMENT:
        return <Scroll {...iconProps} />;
      case TaskType.WAIT_FOR_ELEMENT:
        return <Clock {...iconProps} />;
      case TaskType.DELIVER_VIA_WEBHOOK:
        return <Zap {...iconProps} />;
      default:
        return <Target {...iconProps} />;
    }
  };

  const getTaskDescription = (type: TaskType) => {
    switch (type) {
      case TaskType.PAGE_TO_HTML:
        return {
          title: "Convert Page to HTML",
          description: "Extract the complete HTML content from a webpage. This task captures the full page structure including all HTML elements, making it available for further processing by other tasks in your workflow.",
          useCases: [
            "Web scraping and data extraction",
            "Page content analysis",
            "Creating page snapshots",
            "Content archiving"
          ],
          inputs: ["URL of the webpage to convert"],
          outputs: ["Complete HTML content as string"]
        };
      case TaskType.FILL_INPUT:
        return {
          title: "Fill Input Field",
          description: "Automatically fill text input fields on a webpage. This task can target input fields by various selectors and enter the specified text value.",
          useCases: [
            "Form automation",
            "Data entry tasks",
            "Login form filling",
            "Search field population"
          ],
          inputs: ["CSS selector for input field", "Text value to enter"],
          outputs: ["Confirmation of successful input"]
        };
      case TaskType.CLICK_ELEMENT:
        return {
          title: "Click Element",
          description: "Programmatically click on any clickable element on a webpage. This includes buttons, links, checkboxes, and other interactive elements.",
          useCases: [
            "Button clicking automation",
            "Navigation between pages",
            "Form submission",
            "Modal opening/closing"
          ],
          inputs: ["CSS selector for clickable element"],
          outputs: ["Confirmation of successful click"]
        };
      case TaskType.EXTRACT_TEXT_FROM_ELEMENT:
        return {
          title: "Extract Text from Element",
          description: "Extract text content from specific HTML elements on a webpage. This task can target any element and retrieve its text content for further processing.",
          useCases: [
            "Data extraction from specific elements",
            "Text content analysis",
            "Information gathering",
            "Content monitoring"
          ],
          inputs: ["CSS selector for target element"],
          outputs: ["Extracted text content"]
        };
      case TaskType.EXTRACT_DATA_WITH_AI:
        return {
          title: "Extract Data with AI",
          description: "Use artificial intelligence to intelligently extract structured data from web content. AI analyzes the content and extracts relevant information based on your requirements.",
          useCases: [
            "Intelligent data extraction",
            "Complex content analysis",
            "Structured data parsing",
            "Content categorization"
          ],
          inputs: ["Content to analyze", "Extraction requirements"],
          outputs: ["Structured data in JSON format"]
        };
      case TaskType.READ_PROPERTY_FROM_JSON:
        return {
          title: "Read Property from JSON",
          description: "Extract specific properties or values from JSON data. This task allows you to access nested properties and transform JSON data for use in other workflow steps.",
          useCases: [
            "JSON data parsing",
            "API response processing",
            "Data transformation",
            "Property extraction"
          ],
          inputs: ["JSON data", "Property path to extract"],
          outputs: ["Extracted property value"]
        };
      case TaskType.ADD_PROPERTY_TO_JSON:
        return {
          title: "Add Property to JSON",
          description: "Add new properties or modify existing ones in JSON data. This task allows you to enrich JSON objects with additional information or update existing values.",
          useCases: [
            "JSON data enrichment",
            "Data augmentation",
            "Property addition",
            "JSON modification"
          ],
          inputs: ["JSON data", "Property name", "Property value"],
          outputs: ["Modified JSON with new property"]
        };
      case TaskType.NAVIGATE_URL:
        return {
          title: "Navigate to URL",
          description: "Navigate the browser to a specific URL. This task is essential for moving between different pages during workflow execution.",
          useCases: [
            "Page navigation",
            "Multi-page workflows",
            "URL redirection",
            "Site exploration"
          ],
          inputs: ["Target URL to navigate to"],
          outputs: ["Confirmation of successful navigation"]
        };
      case TaskType.SCROLL_TO_ELEMENT:
        return {
          title: "Scroll to Element",
          description: "Automatically scroll the page to bring a specific element into view. This is useful for elements that are not initially visible on the page.",
          useCases: [
            "Element visibility",
            "Lazy-loaded content",
            "Page scrolling automation",
            "Element interaction preparation"
          ],
          inputs: ["CSS selector for target element"],
          outputs: ["Confirmation of successful scroll"]
        };
      case TaskType.WAIT_FOR_ELEMENT:
        return {
          title: "Wait for Element",
          description: "Wait for a specific element to appear on the page before proceeding. This is crucial for handling dynamic content and ensuring elements are loaded.",
          useCases: [
            "Dynamic content loading",
            "AJAX request completion",
            "Element availability",
            "Timing control"
          ],
          inputs: ["CSS selector for element to wait for", "Timeout duration"],
          outputs: ["Confirmation when element appears"]
        };
      case TaskType.DELIVER_VIA_WEBHOOK:
        return {
          title: "Deliver via Webhook",
          description: "Send data to an external webhook URL. This task allows you to integrate with external services and send processed data to other systems.",
          useCases: [
            "External API integration",
            "Data delivery to third-party services",
            "Workflow completion notifications",
            "Data synchronization"
          ],
          inputs: ["Webhook URL", "Data payload to send"],
          outputs: ["Webhook response status"]
        };
      default:
        return {
          title: "Unknown Task",
          description: "This task type is not recognized.",
          useCases: [],
          inputs: [],
          outputs: []
        };
    }
  };

  const taskInfo = getTaskDescription(taskType);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="fixed right-0 top-0 h-full w-[400px] bg-gradient-to-b from-[#1A1D21] to-[#161920] border-l border-[#2F3033] shadow-2xl transform transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#2F3033] bg-gradient-to-r from-[#1A1D21] to-[#1f2227]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#266DF0] to-[#1e5bcc] rounded-xl flex items-center justify-center shadow-lg ring-2 ring-[#266DF0]/20">
                {getTaskIcon(taskType)}
              </div>
              <div>
                <h2 className="font-bold text-[#eef1f5] text-lg">{taskInfo.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <CoinsIcon size={14} className="text-[#266DF0]" />
                  <span className="text-sm text-[#8b949e]">{task.credits} credits</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-[#8b949e] hover:text-[#eef1f5] hover:bg-[#2F3033]"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-auto h-full">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-[#eef1f5] mb-3 uppercase tracking-wider">Description</h3>
            <p className="text-sm text-[#8b949e] leading-relaxed">{taskInfo.description}</p>
          </div>

          {/* Use Cases */}
          {taskInfo.useCases.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-[#eef1f5] mb-3 uppercase tracking-wider">Use Cases</h3>
              <ul className="space-y-2">
                {taskInfo.useCases.map((useCase, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#266DF0] rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-[#8b949e]">{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Inputs */}
          {taskInfo.inputs.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-[#eef1f5] mb-3 uppercase tracking-wider">Inputs</h3>
              <div className="space-y-2">
                {taskInfo.inputs.map((input, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-[#2F3033] border-[#2F3033] text-[#8b949e]">
                      Input {index + 1}
                    </Badge>
                    <span className="text-sm text-[#8b949e]">{input}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Outputs */}
          {taskInfo.outputs.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-[#eef1f5] mb-3 uppercase tracking-wider">Outputs</h3>
              <div className="space-y-2">
                {taskInfo.outputs.map((output, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-[#2F3033] border-[#2F3033] text-[#8b949e]">
                      Output {index + 1}
                    </Badge>
                    <span className="text-sm text-[#8b949e]">{output}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskDescriptionSidebar;
