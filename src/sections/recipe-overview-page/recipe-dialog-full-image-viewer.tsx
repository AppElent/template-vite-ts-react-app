import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';

interface RecipeDialogFullImageViewerProps {
  selectedImage: string | null;
  setSelectedImage: (value: string | null) => void;
  set: (image: string) => void;
}

const RecipeDialogFullImageViewer = ({
  selectedImage,
  setSelectedImage,
  set,
}: RecipeDialogFullImageViewerProps) => {
  return (
    <Dialog
      open={Boolean(selectedImage)}
      onClose={() => setSelectedImage(null)}
      maxWidth="md"
    >
      <DialogContent>
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Full size"
            style={{ width: '100%', height: 'auto' }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button
          disabled={!selectedImage}
          onClick={() => {
            if (selectedImage) set(selectedImage);
            setSelectedImage(null);
          }}
          color="primary"
        >
          Set as main image
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecipeDialogFullImageViewer;
