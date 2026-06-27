import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { urlService } from '../services/url.service';
import { useClipboard } from '../hooks/useClipboard';
import Navbar from '../components/layout/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Loader2, Copy, Check, ExternalLink, Link2 } from 'lucide-react';
import type { UrlResponse } from '../types/url.types';

const urlFormSchema = z.object({
  originalUrl: z.string().url('Enter a valid URL starting with http:// or https://'),
});

type UrlFormValues = z.infer<typeof urlFormSchema>;

export default function DashboardPage() {
  const { copy } = useClipboard();
  const [urls, setUrls] = useState<UrlResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UrlFormValues>({
    resolver: zodResolver(urlFormSchema),
  });

  const fetchUrls = async () => {
    try {
      const response = await urlService.getUserUrls();
      if (response.data?.success && response.data.data) {
        setUrls(response.data.data);
      }
    } catch (error: any) {
      toast.error('Failed to fetch your links.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const onSubmit = async (data: UrlFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await urlService.createUrl(data.originalUrl);
      if (response.data?.success && response.data.data) {
        const newUrl = response.data.data;
        setUrls((prev) => [newUrl, ...prev]);
        reset();
        toast.success('URL shortened!', {
          description: `Short URL: ${getFullShortUrl(newUrl.shortCode)}`,
        });
      } else {
        throw new Error(response.data?.message || 'Failed to shorten URL.');
      }
    } catch (error: any) {
      const serverMessage = error.response?.data?.message || error.message || 'An error occurred.';
      toast.error(serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (errors: any) => {
    Object.values(errors).forEach((error: any) => {
      if (error?.message) {
        toast.error(error.message as string);
      }
    });
  };

  const handleCopy = async (id: string, text: string) => {
    await copy(text);
    setCopiedId(id);
    toast.success('Short URL copied to clipboard.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'yesterday';
    return `${diffDays} days ago`;
  };

  const truncateUrl = (url: string, maxLength = 40) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  const cleanDisplayUrl = (urlStr: string) => {
    return urlStr
      .replace(/^https?:\/\//, '')
      .replace(/^(localhost:\d+|127\.0\.0\.1:\d+)/, 'linksnip.co');
  };

  const getFullShortUrl = (shortCode: string) => {
    return `${window.location.origin}/r/${shortCode}`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-screen-xl w-full mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Shortener Card */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold tracking-tight">Shorten a URL</CardTitle>
            <CardDescription>
              Paste a long URL and get a short link instantly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2 items-start">
                <div className="w-full space-y-1">
                  <Input
                    type="text"
                    placeholder="https://example.com/very-long-url-to-shorten"
                    disabled={isSubmitting}
                    className="w-full border-input"
                    {...register('originalUrl')}
                  />
                  {errors.originalUrl && (
                    <p className="text-sm text-destructive">{errors.originalUrl.message}</p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Shortening...
                    </>
                  ) : (
                    'Shorten'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Links Table */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
            <Link2 className="h-5 w-5 text-muted-foreground" />
            My Links
          </h2>

          <div className="border border-border rounded-md bg-white overflow-hidden">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex space-x-4 items-center h-10">
                    <div className="animate-pulse bg-muted rounded-md h-5 w-6" />
                    <div className="animate-pulse bg-muted rounded-md h-5 flex-1" />
                    <div className="animate-pulse bg-muted rounded-md h-5 w-32" />
                    <div className="animate-pulse bg-muted rounded-md h-5 w-12" />
                    <div className="animate-pulse bg-muted rounded-md h-5 w-20" />
                  </div>
                ))}
              </div>
            ) : urls.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="rounded-full bg-secondary p-3">
                  <Link2 className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-base">No links yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Paste a long URL in the field above to create your first short link.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 text-center">#</TableHead>
                      <TableHead>Original URL</TableHead>
                      <TableHead>Short URL</TableHead>
                      <TableHead className="text-center w-24">Clicks</TableHead>
                      <TableHead className="w-32">Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {urls.map((url, index) => (
                      <TableRow key={url.id}>
                        <TableCell className="text-center font-medium text-muted-foreground">
                          {urls.length - index}
                        </TableCell>
                        <TableCell 
                          className="max-w-xs md:max-w-md truncate" 
                          title={url.originalUrl}
                        >
                          <span className="cursor-help border-b border-dashed border-muted-foreground/30">
                            {truncateUrl(url.originalUrl)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <a
                              href={getFullShortUrl(url.shortCode)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-foreground font-medium hover:underline flex items-center gap-1 group"
                            >
                              {cleanDisplayUrl(getFullShortUrl(url.shortCode))}
                              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              onClick={() => handleCopy(url.id, getFullShortUrl(url.shortCode))}
                            >
                              {copiedId === url.id ? (
                                <Check className="h-3.5 w-3.5 text-green-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="font-mono">
                            {url.clickCount}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {getRelativeTime(url.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
