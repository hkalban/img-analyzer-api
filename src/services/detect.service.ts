import vision from '@google-cloud/vision';

class DetectService {
  public static async analyzeImage(image: string): Promise<string[]> {
    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    // Performs label detection on the image file
    const [result] = await client.labelDetection(image);
    const labels = result.labelAnnotations;

    return labels.map(label => label.description);
  }
}

export default DetectService;
