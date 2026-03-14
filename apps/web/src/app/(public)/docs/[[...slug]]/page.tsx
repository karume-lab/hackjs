import { Alert, AlertDescription, AlertTitle } from "@repo/ui/web/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/web/components/ui/tabs";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { Step, Steps } from "fumadocs-ui/components/steps";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { source } from "@/lib/source";

const Page = async (props: { params: Promise<{ slug?: string[] }> }) => {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={{
            ...defaultMdxComponents,
            pre: ({ ref: _ref, ...props }) => (
              <CodeBlock {...props}>
                <Pre>{props.children}</Pre>
              </CodeBlock>
            ),
            Alert,
            AlertTitle,
            AlertDescription,
            Tabs,
            TabsList,
            TabsTrigger,
            TabsContent,
            Step,
            Steps,
          }}
        />
      </DocsBody>
    </DocsPage>
  );
};

export default Page;

export const generateStaticParams = async () => {
  return source.generateParams();
};

export const generateMetadata = async (props: { params: Promise<{ slug?: string[] }> }) => {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
};
