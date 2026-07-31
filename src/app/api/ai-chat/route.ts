import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are ICON, the intelligent AI Sales & Solutions Consultant for ICONIC GH — Ghana's premier Software Development & Digital Marketing Agency based in Tema / Accra, Ghana.

YOUR PURPOSE:
Qualify prospective clients, recommend the best package for their business goals, answer questions about engineering/marketing capabilities, and capture leads to connect them directly with our sales team via WhatsApp (+233500329461) or our contact form.

COMPANY SERVICES & PACKAGES:
1. Startup Landing Page (GH₵3,500 | 1 week): Single high-converting landing page, mobile-first design, lead capture form, hosting & domain setup.
2. Professional Business Site (GH₵8,500 | 3 weeks): Up to 5 pages, dynamic news/blog engine, SEO & performance optimization, interactive cost calculators.
3. Premium E-Commerce Catalog (GH₵18,500 | 5 weeks): Complete store, Mobile Money & card payments, inventory panel, WhatsApp order routing.
4. Custom SaaS Application (GH₵45,000 | 8 weeks): Full-stack cloud platform, user auth, database architecture, payment integrations, custom admin dashboard.
5. Enterprise AI & Cloud Platform (GH₵95,000+ | 12+ weeks): Custom AI models, LLM integration, real-time data pipelines, enterprise infrastructure.
6. Digital Marketing & Growth Retainers (from GH₵2,500/mo): SEO, PPC Ads (Meta/Google), Social Media Management, Content Creation.

BEHAVIOR RULES:
- Be warm, professional, concise, and focused on business value & ROI.
- Ask friendly qualifying questions: What type of business do they run? What's their main goal? Ideal timeline & budget?
- Always match their requirements to one of our packages or custom solutions.
- Offer actionable advice and encourage them to book a free strategy call or request a custom proposal.
- Keep responses short (2-4 paragraphs max) so they fit nicely in a mobile chat interface. Use markdown formatting like bolding and bullet points.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback rule-based response when GEMINI_API_KEY is not configured
      const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content?.toLowerCase() || '';
      
      let reply = "Hello! I'm **ICON**, ICONIC GH's AI Sales & Solutions Advisor. How can we help transform your digital presence today?";
      
      if (lastUserMsg.includes('price') || lastUserMsg.includes('cost') || lastUserMsg.includes('how much') || lastUserMsg.includes('package')) {
        reply = "Here are our core solution packages:\n\n" +
          "• **Startup Landing Page**: GH₵3,500 (1 week)\n" +
          "• **Professional Business Site**: GH₵8,500 (3 weeks)\n" +
          "• **E-Commerce Catalog**: GH₵18,500 (5 weeks)\n" +
          "• **Custom SaaS / Mobile App**: GH₵45,000 (8 weeks)\n" +
          "• **Digital Growth Retainer**: From GH₵2,500/mo\n\n" +
          "Which of these aligns best with your project goals?";
      } else if (lastUserMsg.includes('website') || lastUserMsg.includes('site') || lastUserMsg.includes('web')) {
        reply = "We design high-converting, blazing-fast web applications! Are you looking for a **brand site**, an **e-commerce store**, or a **custom web application**?";
      } else if (lastUserMsg.includes('app') || lastUserMsg.includes('mobile') || lastUserMsg.includes('saas')) {
        reply = "We build native & cross-platform mobile apps (iOS & Android) and cloud SaaS platforms with integrated Mobile Money payments. What kind of app are you planning?";
      } else if (lastUserMsg.includes('marketing') || lastUserMsg.includes('seo') || lastUserMsg.includes('ads')) {
        reply = "Our growth marketing team specializes in SEO, Google & Meta Ads, and social media campaigns designed to generate high-intent leads. Would you like a free marketing audit?";
      } else if (lastUserMsg.includes('contact') || lastUserMsg.includes('whatsapp') || lastUserMsg.includes('call') || lastUserMsg.includes('quote') || lastUserMsg.includes('book')) {
        reply = "Awesome! You can connect with our senior engineers immediately via **WhatsApp at +233 50 032 9461** or fill out our quick contact form on the home page for a free strategy proposal.";
      } else if (messages.length > 2) {
        reply = "That sounds like a great project! I'd love to put together a tailored scope for you. Would you like to connect with our team via **WhatsApp** or have us email you a full proposal?";
      }

      return NextResponse.json({ reply });
    }

    // Call Gemini 1.5 Flash API
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      })
    });

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I'm having trouble processing that request right now. Please chat with us directly on WhatsApp at +233500329461!";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ 
      reply: "Thank you for reaching out! Connect directly with our engineering team on WhatsApp at +233500329461 or scroll down to fill out our contact form." 
    });
  }
}
