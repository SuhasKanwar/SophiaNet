'use client';

import { useState } from 'react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { 
  ChevronDownIcon, 
  ChevronRightIcon,
  DocumentTextIcon,
  PhotoIcon,
  CpuChipIcon,
  Cog6ToothIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';

interface Functionality {
  id: string;
  heading: string;
  subHeading: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  demonstration: {
    type: 'video' | 'image' | 'interactive';
    content: string;
    alt?: string;
  };
}

const functionalities: Functionality[] = [
  {
    id: 'input-ingestion',
    heading: 'Input Ingestion',
    subHeading: 'Multi-Modal Data Collection',
    description: 'Seamlessly capture and process various input types including scanned handwritten notes, YouTube videos with frames and audio extraction, and real-time web data from news articles and social media platforms. Our advanced ingestion pipeline ensures no information is lost during the initial capture phase.',
    icon: DocumentTextIcon,
    demonstration: {
      type: 'image',
      content: '/api/placeholder/600/400',
      alt: 'Input ingestion demonstration showing various data sources'
    }
  },
  {
    id: 'dip-preprocessing',
    heading: 'Digital Image Processing',
    subHeading: 'Advanced Visual Enhancement',
    description: 'Transform raw visual inputs using state-of-the-art DIP techniques including denoising, binarization, and deskewing. Extract diagrams, mathematical formulas, and handwritten text through sophisticated contour detection, edge detection, and OCR. Enhance video frames with super-resolution and intelligent scene detection.',
    icon: PhotoIcon,
    demonstration: {
      type: 'interactive',
      content: 'DIP preprocessing pipeline visualization',
      alt: 'Interactive DIP preprocessing demonstration'
    }
  },
  {
    id: 'ai-generation',
    heading: 'AI Understanding & Generation',
    subHeading: 'Intelligent Content Creation',
    description: 'Leverage CLIP embeddings to align text, images, and video into a unified representation space. Utilize advanced LLMs for summarization, Q&A generation, and knowledge synthesis. Generate stunning visuals with Stable Diffusion and create educational video content with text-to-video models.',
    icon: CpuChipIcon,
    demonstration: {
      type: 'video',
      content: '/api/placeholder/600/400',
      alt: 'AI generation process demonstration'
    }
  },
  {
    id: 'agent-orchestration',
    heading: 'Agent Orchestration',
    subHeading: 'Autonomous System Management',
    description: 'Experience the power of our specialized agent ecosystem: Crawler Agent for content collection, Notes Agent for OCR and formatting, Embedding Agent for feature extraction, Generation Agent for creative outputs, Analysis Agent for insights, and Orchestrator Agent for seamless coordination.',
    icon: Cog6ToothIcon,
    demonstration: {
      type: 'interactive',
      content: 'Agent orchestration workflow',
      alt: 'Interactive agent orchestration demonstration'
    }
  },
  {
    id: 'output-delivery',
    heading: 'Smart Output Delivery',
    subHeading: 'Enhanced Knowledge Products',
    description: 'Receive beautifully formatted digitized notes, AI-generated educational videos, optimized thumbnails and posters, cross-modal semantic search capabilities, and real-time trend monitoring dashboards. All outputs are designed to maximize engagement and knowledge retention.',
    icon: PresentationChartLineIcon,
    demonstration: {
      type: 'image',
      content: '/api/placeholder/600/400',
      alt: 'Smart output delivery showcase'
    }
  }
];

export default function FunctionalitiesSection() {
  const [expandedId, setExpandedId] = useState<string | null>('input-ingestion');
  const [selectedDemo, setSelectedDemo] = useState<Functionality>(functionalities[0]);
  
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  const handleFunctionalityClick = (functionality: Functionality) => {
    setExpandedId(expandedId === functionality.id ? null : functionality.id);
    setSelectedDemo(functionality);
  };

  const renderDemonstration = () => {
    switch (selectedDemo.demonstration.type) {
      case 'image':
        return (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center border border-gray-700">
            <div className="text-center p-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">{selectedDemo.heading}</h3>
              <p className="text-gray-300 text-lg">{selectedDemo.demonstration.alt}</p>
            </div>
          </div>
        );
      case 'video':
        return (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center border border-gray-700">
            <div className="text-center p-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">{selectedDemo.heading}</h3>
              <p className="text-gray-300 text-lg">{selectedDemo.demonstration.alt}</p>
            </div>
          </div>
        );
      case 'interactive':
        return (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center border border-gray-700">
            <div className="text-center p-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">{selectedDemo.heading}</h3>
              <p className="text-gray-300 text-lg">{selectedDemo.demonstration.content}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.section 
      ref={sectionRef}
      className="py-20 px-4"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <div className="max-w-[80vw] mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Core Functionalities
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover how SophiaNet transforms your knowledge processing workflow through 
            advanced AI technologies and intelligent automation.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          <motion.div 
            className="lg:col-span-2 space-y-4"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-2xl font-semibold text-white mb-6">
              System Capabilities
            </h3>
            
            {functionalities.map((functionality, index) => {
              const IconComponent = functionality.icon;
              return (
                <motion.div
                  key={functionality.id}
                  className={`group border rounded-xl p-6 cursor-pointer transition-all duration-500 ${
                    expandedId === functionality.id
                      ? 'border-blue-500 bg-gray-900/50 shadow-lg shadow-blue-500/10'
                      : 'border-gray-700 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50 hover:shadow-md'
                  }`}
                  onClick={() => handleFunctionalityClick(functionality)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-3 rounded-lg transition-all duration-300 ${
                        expandedId === functionality.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 text-gray-300 group-hover:bg-gray-600'
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1 group-hover:translate-x-2 transition-transform duration-300">
                        <h4 className="text-lg font-semibold text-white mb-1">
                          {functionality.heading}
                        </h4>
                        <p className="text-sm text-gray-400 mb-3">
                          {functionality.subHeading}
                        </p>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      {expandedId === functionality.id ? (
                        <ChevronDownIcon className="w-5 h-5 text-blue-500" />
                      ) : (
                        <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  <div className={`overflow-hidden transition-all duration-500 ${
                    expandedId === functionality.id ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-gray-300 leading-relaxed">
                        {functionality.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div 
            className="lg:col-span-3 lg:sticky lg:top-8 mt-13"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-2xl font-semibold text-white">
                  {selectedDemo.subHeading}
                </h3>
              </div>
              
              <div className="aspect-video p-8">
                {renderDemonstration()}
              </div>
              
              <div className="p-6 bg-gray-900/30">
                <h4 className="font-semibold text-white mb-3 text-lg">
                  Featured Capability: {selectedDemo.heading}
                </h4>
                <p className="text-gray-300 leading-relaxed">
                  {selectedDemo.description.substring(0, 180)}...
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}