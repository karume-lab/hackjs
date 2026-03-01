import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/web/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/web/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/web/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/web/components/ui/tabs";
import type { MDXComponents } from "mdx/types";
import { Steps } from "@/components/mdx/steps";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Steps,
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    Alert,
    AlertTitle,
    AlertDescription,
  };
}
