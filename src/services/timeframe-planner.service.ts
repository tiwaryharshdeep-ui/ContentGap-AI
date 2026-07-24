import { ContentCalendarItem } from '../models/calendar.model.js';
import { ContentCalendarItemSchema } from '../models/schema.js';
import { PriorityEngine } from './priority-engine.js';

export interface TimeframePlanOptions {
  timeframeDays: 30 | 60 | 90;
  postsPerWeek?: number; // Default 2 posts per week
  domainUrl?: string;
  previewMode?: boolean; // If true, cap output to compact sample preview
}

export class TimeframePlannerService {
  private priorityEngine = new PriorityEngine();

  private predefinedTopics = [
    { title: 'Kedarkantha Winter Snow Trek Complete Itinerary & Packing Guide', primaryKeyword: 'kedarkantha winter trek', searchIntent: 'Informational' as const, contentType: 'Trekking Itinerary', targetAudience: 'Snow Trekkers & Beginners', cta: 'Book Kedarkantha Winter Trek', priority: 'High' as const },
    { title: 'Top 10 High-Altitude Trekking Shoes & Boots Comparison', primaryKeyword: 'best trekking shoes india', searchIntent: 'Commercial' as const, contentType: 'Listicle / Comparison', targetAudience: 'Outdoor Gear Buyers', cta: 'Check Best Trekking Shoes Prices', priority: 'High' as const },
    { title: 'Har Ki Dun Spring Valley Trek: Best Month & Route Details', primaryKeyword: 'har ki dun trek spring', searchIntent: 'Informational' as const, contentType: 'Comprehensive Guide', targetAudience: 'Nature Lovers & Photographers', cta: 'Explore Har Ki Dun Trek Route', priority: 'Medium' as const },
    { title: 'How to Prevent Acute Mountain Sickness (AMS) at 12,000+ Feet', primaryKeyword: 'acute mountain sickness prevention', searchIntent: 'Informational' as const, contentType: 'Safety & Health Guide', targetAudience: 'First-time High Altitude Trekkers', cta: 'Read High Altitude Safety Checklist', priority: 'High' as const },
    { title: 'Valley of Flowers Monsoon Trek: Permits, Flora & Budget', primaryKeyword: 'valley of flowers monsoon trek', searchIntent: 'Commercial' as const, contentType: 'Comprehensive Guide', targetAudience: 'Monsoon Trekkers & Botanists', cta: 'Reserve Monsoon Trek Package', priority: 'High' as const },
    { title: '40L vs 60L Rucksack: Which Backpack Size Do You Need?', primaryKeyword: '40l vs 60l backpack trekking', searchIntent: 'Commercial' as const, contentType: 'Product Comparison', targetAudience: 'Backpackers & Gear Buyers', cta: 'Find Ideal Backpack Size', priority: 'Medium' as const },
    { title: 'Roopkund Autumn Trek: Complete Weather & Trail Breakdown', primaryKeyword: 'roopkund autumn trek permit', searchIntent: 'Informational' as const, contentType: 'Trekking Itinerary', targetAudience: 'Experienced High Altitude Backpackers', cta: 'Check Roopkund Trek Eligibility', priority: 'High' as const },
    { title: 'How to Pack a Backpack for a 5-Day Himalayan Trek (Weight Distribution)', primaryKeyword: 'how to pack trekking backpack', searchIntent: 'Informational' as const, contentType: 'How-To Guide', targetAudience: 'Beginner & Intermediate Trekkers', cta: 'Download Free Backpacking Checklist', priority: 'Medium' as const },
    { title: 'Brahmatal Snow Trek vs Kedarkantha: Which Winter Trek is Best?', primaryKeyword: 'brahmatal vs kedarkantha', searchIntent: 'Commercial' as const, contentType: 'Trek Comparison', targetAudience: 'Winter Snow Trekkers', cta: 'Compare Winter Trek Packages', priority: 'High' as const },
    { title: 'Essential 3-Layer Clothing System for Sub-Zero Trekking', primaryKeyword: 'layering system winter trek', searchIntent: 'Informational' as const, contentType: 'Gear & Prep Guide', targetAudience: 'Winter Adventure Seekers', cta: 'Shop Layering Gear Recommendations', priority: 'Medium' as const },
    { title: 'Sandakphu Phalut Trek Guide: Sleeping Bag vs Tea House Stay', primaryKeyword: 'sandakphu trek guide', searchIntent: 'Informational' as const, contentType: 'Trekking Itinerary', targetAudience: 'Everest View Trekkers & Photographers', cta: 'Explore Sandakphu Tea House Trek', priority: 'High' as const },
    { title: 'Fitness Plan for Himalayan Treks: 4-Week Workout Routine', primaryKeyword: 'trekking fitness routine', searchIntent: 'Informational' as const, contentType: 'Fitness Guide', targetAudience: 'Aspiring Trekkers & Gym Goers', cta: 'Start 4-Week Fitness Prep Today', priority: 'Medium' as const },
    { title: 'Hampta Pass Monsoon Crossing: Chandratal Lake Itinerary', primaryKeyword: 'hampta pass trek cost', searchIntent: 'Commercial' as const, contentType: 'Trekking Itinerary', targetAudience: 'Pass-Crossing Trekkers', cta: 'Book Hampta Pass Expedition', priority: 'High' as const },
    { title: 'Down vs Synthetic Sleeping Bags for Himalayan Winter Camping', primaryKeyword: 'down vs synthetic sleeping bag', searchIntent: 'Commercial' as const, contentType: 'Gear Review', targetAudience: 'Winter Campers', cta: 'View Recommended Sleeping Bags', priority: 'Low' as const },
    { title: 'Trekking Pole Basics: Dual vs Single Pole for Steep Decents', primaryKeyword: 'trekking pole benefit steep descent', searchIntent: 'Informational' as const, contentType: 'Gear Guide', targetAudience: 'Knee Health Conscious Trekkers', cta: 'Read Trekking Pole Buying Tips', priority: 'Low' as const },
    { title: 'Kuari Pass Winter Trek: Lord Curzon Trail Experience', primaryKeyword: 'kuari pass winter trek', searchIntent: 'Informational' as const, contentType: 'Comprehensive Guide', targetAudience: 'Nanda Devi View Seekers', cta: 'Book Kuari Pass Snow Trek', priority: 'High' as const },
    { title: 'How to Choose Sleeping Pads: R-Value Explained for Cold Weather', primaryKeyword: 'sleeping pad r value winter camping', searchIntent: 'Commercial' as const, contentType: 'Gear Guide', targetAudience: 'Camping Enthusiasts', cta: 'Check Insulated Sleeping Pads', priority: 'Low' as const },
    { title: 'Monsoon Trekking Survival Guide: Leech Prevention & Waterproofing', primaryKeyword: 'leech prevention monsoon trek', searchIntent: 'Informational' as const, contentType: 'Survival & Prep Guide', targetAudience: 'Monsoon Outdoor Adventurers', cta: 'Get Monsoon Protection Tips', priority: 'Medium' as const },
    { title: 'Day Hike vs Multi-Day Himalayan Trek: Which Should You Start With?', primaryKeyword: 'day hike vs multi day trek', searchIntent: 'Informational' as const, contentType: 'Beginner Guide', targetAudience: 'Weekend Hikers & Novices', cta: 'Find Beginner Friendly Hikes', priority: 'Low' as const },
    { title: 'Trek Leader vs Self-Guided Trekking in Uttarakhand: Safety & Permits', primaryKeyword: 'self guided trek uttarakhand permit', searchIntent: 'Informational' as const, contentType: 'Safety & Regulations', targetAudience: 'Independent Travelers', cta: 'Check Uttarakhand Trek Permits', priority: 'Medium' as const },
    { title: 'Best Portable Water Filters & Purification Tablets for Trail Use', primaryKeyword: 'water purification tablets trekking', searchIntent: 'Commercial' as const, contentType: 'Product Comparison', targetAudience: 'Wilderness Backpackers', cta: 'Shop Water Purification Solutions', priority: 'Medium' as const },
    { title: 'Pin Parvati Pass Trek: Hardest Himalayan High Altitude Trek', primaryKeyword: 'pin parvati pass trek difficulty', searchIntent: 'Informational' as const, contentType: 'Expedition Guide', targetAudience: 'Expert Trekkers', cta: 'View Expedition Prerequisites', priority: 'High' as const },
    { title: 'Goechala Kanchenjunga View Trek: Best Season & Permit Process', primaryKeyword: 'goechala trek permit sikkim', searchIntent: 'Informational' as const, contentType: 'Comprehensive Guide', targetAudience: 'Sikkim Himalayan Trekkers', cta: 'Book Goechala Expedition', priority: 'High' as const },
    { title: 'Photography Tips for Snow Treks: Battery Maintenance in Cold Weather', primaryKeyword: 'snow trekking photography tips cold battery', searchIntent: 'Informational' as const, contentType: 'Photography Guide', targetAudience: 'Trail Photographers & Content Creators', cta: 'Read Cold Weather Camera Guide', priority: 'Low' as const },
  ];

  generatePlan(options: TimeframePlanOptions): ContentCalendarItem[] {
    const { timeframeDays, postsPerWeek = 2, previewMode } = options;
    const totalWeeks = Math.ceil(timeframeDays / 7);
    let totalPostsNeeded = totalWeeks * postsPerWeek;

    if (previewMode) {
      const sampleCap = timeframeDays === 30 ? 4 : timeframeDays === 60 ? 5 : 6;
      totalPostsNeeded = Math.min(totalPostsNeeded, sampleCap);
    }

    const calendar: ContentCalendarItem[] = [];
    const today = new Date();
    const daysInterval = 7 / postsPerWeek;

    for (let i = 0; i < totalPostsNeeded; i++) {
      const topicIndex = i % this.predefinedTopics.length;
      const topic = this.predefinedTopics[topicIndex];

      const publishDateObj = new Date(today);
      publishDateObj.setDate(today.getDate() + Math.round((i + 1) * daysInterval));
      const publishDate = publishDateObj.toISOString().substring(0, 10);

      const secondaryKeywords = [
        topic.primaryKeyword,
        'himalayan trekking',
        'travel guide 2026',
      ];

      const slug = topic.primaryKeyword.replace(/\s+/g, '-');
      const item: ContentCalendarItem = {
        id: `timeframe-${timeframeDays}d-${Date.now()}-${i + 1}`,
        publishDate,
        blogTitle: topic.title,
        primaryKeyword: topic.primaryKeyword,
        secondaryKeywords,
        searchIntent: topic.searchIntent,
        targetAudience: topic.targetAudience,
        contentType: topic.contentType,
        linkToBlog: `/blog/${slug}`,
        cta: topic.cta,
        priority: topic.priority,
        sourceType: 'ManualPost',
      };

      ContentCalendarItemSchema.parse(item);
      calendar.push(item);
    }

    return calendar;
  }
}
