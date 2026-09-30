export async function calculateDistance(originZip: string, destinationZip: string): Promise<number> {
  // In a real application, you would use an external API like Mapbox or OpenRouteService
  // e.g., const response = await fetch(`https://api.mapbox.com/directions/v5/...`);
  // For this MVP, we will use a mocked deterministic haversine-like calculation based on zips
  
  // A simple hash function to generate a consistent distance based on the zips
  const str = `${originZip}-${destinationZip}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Generate a plausible distance between 50 and 2500 miles
  const distance = Math.abs(hash) % 2450 + 50;
  return distance;
}
