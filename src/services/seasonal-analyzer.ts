import { SeasonalTripItem } from '../models/audit.model.js';

export class SeasonalAnalyzer {
  private seasonalTripsConfig = [
    {
      tripName: 'Kedarkantha Winter Snow Trek',
      peakMonths: ['December', 'January', 'February'],
      peakStartMonth: 12, // December
      primaryKeyword: 'kedarkantha winter trek itinerary',
      targetAudience: 'Snow Trekkers & Beginners',
    },
    {
      tripName: 'Har Ki Dun Spring Valley Trek',
      peakMonths: ['April', 'May', 'June'],
      peakStartMonth: 4, // April
      primaryKeyword: 'har ki dun spring trek guide',
      targetAudience: 'Nature Lovers & Photographers',
    },
    {
      tripName: 'Valley of Flowers Monsoon Trek',
      peakMonths: ['July', 'August', 'September'],
      peakStartMonth: 7, // July
      primaryKeyword: 'valley of flowers monsoon trek cost',
      targetAudience: 'Botany & Monsoon Trekkers',
    },
    {
      tripName: 'Roopkund Autumn High Altitude Trek',
      peakMonths: ['September', 'October', 'November'],
      peakStartMonth: 9, // September
      primaryKeyword: 'roopkund autumn trek permit',
      targetAudience: 'Experienced High Altitude Backpackers',
    },
  ];

  /**
   * Generates seasonal trekking trip content targets scheduled 60-90 days prior to peak season
   */
  analyzeSeasonalTrips(): SeasonalTripItem[] {
    const currentYear = new Date().getFullYear();
    const items: SeasonalTripItem[] = [];

    for (const trip of this.seasonalTripsConfig) {
      // Calculate start date of peak season
      const peakStartDate = new Date(currentYear, trip.peakStartMonth - 1, 1);
      
      // Target publication date 75 days (between 60 and 90 days) prior to peak start
      const targetPublishDate = new Date(peakStartDate);
      targetPublishDate.setDate(targetPublishDate.getDate() - 75);

      const publishDateStr = targetPublishDate.toISOString().substring(0, 10);

      items.push({
        tripId: `season-${Date.now()}-${items.length + 1}`,
        tripName: trip.tripName,
        peakSeasonMonths: trip.peakMonths,
        recommendedPublishDate: publishDateStr,
        targetAudience: trip.targetAudience,
        primaryKeyword: trip.primaryKeyword,
        priority: 'High',
      });
    }

    return items;
  }
}
