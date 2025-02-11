import { render, screen} from "@testing-library/react";
import { FilesUpload } from "../FilesUpload";
import { FilesUploadError } from "../FilesUploadError";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FilesUploadState } from "../FilesUpload";


describe('FilesUpload', () => {
    const mockUploadFile = vi.fn();

    const defaultProps = {
        title: "Upload Files",
        inputName: "fileUpload",
        uploadFile: mockUploadFile,
        warningTitle: "Warning",
        cancelButtonLabel: "Cancel",
        deleteButtonLabel: "Delete",
        warningDescription: "This is a warning",
        uploadProgressLabel: "Uploading...",
        selectFilesButtonLabel: "Select Files",
        selectMoreFilesButtonLabel: "Select More Files",
    };

    beforeEach(() => {
        mockUploadFile.mockClear();
    });

    it('renders the initial state correctly', () => {
        render(<FilesUpload {...defaultProps} />);
        expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
        expect(screen.getByText(defaultProps.selectFilesButtonLabel)).toBeInTheDocument();
    });

    it('handles file selection and upload success', async () => {
        mockUploadFile.mockResolvedValueOnce(undefined);
        render(<FilesUpload {...defaultProps} />);
        
        const file = new File([""], "testfile.pdf", { type: "application/pdf" });
        const input = screen.getByText(defaultProps.selectFilesButtonLabel);
        
        fireEvent.change(input, { target: { files: [file] } });
        
        await waitFor(() => expect(mockUploadFile).toHaveBeenCalledWith(file));
        expect(screen.getByText(file.name)).toBeInTheDocument();
        expect(screen.getByText(defaultProps.uploadProgressLabel)).toBeInTheDocument();
    });

    it('handles file selection and upload error', async () => {
        mockUploadFile.mockRejectedValueOnce(new Error("Upload failed"));
        render(<FilesUpload {...defaultProps} />);
        
        const file = new File([""], "testfile.pdf", { type: "application/pdf" });
        const input = screen.getByLabelText(defaultProps.selectFilesButtonLabel);
        
        fireEvent.change(input, { target: { files: [file] } });
        
        await waitFor(() => expect(mockUploadFile).toHaveBeenCalledWith(file));
        expect(screen.getByText("Upload failed")).toBeInTheDocument();
    });
});
