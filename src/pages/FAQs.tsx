
import { useState } from "react";
import { faqs } from "@/data/faqs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";

const FAQs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredFaqs = searchQuery
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : faqs;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 flex flex-col p-4 md:p-8">
        <div className="w-full max-w-3xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
            <p className="text-gray-600">
              Find answers to common questions about hostel and mess facilities
            </p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search FAQs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-sm">
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                <p className="text-center p-4 text-gray-500">
                  No FAQs matching your search. Try different keywords.
                </p>
              )}
            </Accordion>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQs;
