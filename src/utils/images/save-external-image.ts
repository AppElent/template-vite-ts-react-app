async function saveExternalImage(imageUrl: string, saveFunction: (blob: Blob) => Promise<any>) {
  try {
    // Step 1: Fetch the external image
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to fetch the image');

    // Step 2: Convert the fetched response to a Blob
    const blob = await response.blob();

    // Step 3: Call the save function with the Blob
    const result = await saveFunction(blob);

    console.log('Image saved successfully!', result);
    return result; // Return the result of the save function
  } catch (error) {
    console.error('Error saving external image:', error);
    return null; // Optionally return null or handle error as needed
  }
}

export default saveExternalImage;
