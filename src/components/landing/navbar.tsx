"use client";

import Link from "next/link";
import { MenuIcon, SearchIcon, ShieldHalf } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const topics = [
  { title: "Phishing", description: "Email, SMS and voice scams", href: "/category/phishing" },
  { title: "Ransomware", description: "Encrypted files and extortion", href: "/category/ransomware" },
  { title: "UPI Fraud", description: "Payment app scams in India", href: "/category/upi-fraud" },
  { title: "Data Breaches", description: "Leaks, credential dumps", href: "/category/data-breaches" },
  { title: "Identity Theft", description: "Stolen KYC, impersonation", href: "/category/identity-theft" },
  { title: "Dark Web", description: "Marketplaces and threats", href: "/category/dark-web" },
];

export function Navbar() {
  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2">
            <ShieldHalf className="h-7 w-7 text-primary" aria-hidden />
            <span className="text-lg font-semibold tracking-tight">
              CyberSathi
            </span>
          </Link>

          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Topics</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-2 p-3">
                    {topics.map((topic) => (
                      <NavigationMenuLink
                        key={topic.title}
                        render={<Link href={topic.href} />}
                        className="block rounded-md p-3 transition-colors hover:bg-muted/70"
                      >
                        <p className="mb-1 font-semibold text-foreground">
                          {topic.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {topic.description}
                        </p>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  render={<Link href="/blog" />}
                  className={navigationMenuTriggerStyle()}
                >
                  Blog
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  render={<Link href="/news" />}
                  className={navigationMenuTriggerStyle()}
                >
                  News
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  render={<Link href="/videos" />}
                  className={navigationMenuTriggerStyle()}
                >
                  Videos
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  render={<Link href="/about" />}
                  className={navigationMenuTriggerStyle()}
                >
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="hidden items-center gap-3 lg:flex">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              nativeButton={false}
              render={<Link href="/search" />}
            >
              <SearchIcon className="h-4 w-4" />
            </Button>
            <ThemeToggle />
            <Button nativeButton={false} render={<Link href="#newsletter" />}>Subscribe</Button>
          </div>

          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline" size="icon" aria-label="Open menu" />
              }
              className="lg:hidden"
            >
              <MenuIcon className="h-4 w-4" />
            </SheetTrigger>
            <SheetContent side="top" className="max-h-screen overflow-auto">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2">
                    <ShieldHalf className="h-6 w-6 text-primary" aria-hidden />
                    <span className="text-lg font-semibold tracking-tight">
                      CyberSathi
                    </span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col p-4">
                <Accordion className="mb-2">
                  <AccordionItem value="topics" className="border-none">
                    <AccordionTrigger className="text-base hover:no-underline">
                      Topics
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid md:grid-cols-2">
                        {topics.map((topic) => (
                          <Link
                            href={topic.href}
                            key={topic.title}
                            className="rounded-md p-3 transition-colors hover:bg-muted/70"
                          >
                            <p className="mb-1 font-semibold text-foreground">
                              {topic.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {topic.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="flex flex-col gap-6 py-2">
                  <Link href="/blog" className="font-medium">Blog</Link>
                  <Link href="/news" className="font-medium">News</Link>
                  <Link href="/videos" className="font-medium">Videos</Link>
                  <Link href="/about" className="font-medium">About</Link>
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  <Button nativeButton={false} render={<Link href="#newsletter" />}>Subscribe</Button>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Theme</span>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
