import Modal from "./modal";
import useuploadmodal from '@/hooks/useuploadmodal';
import { FieldValues, useForm, SubmitHandler } from 'react-hook-form';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import React, { useState } from 'react';
import { toast } from "react-hot-toast";
import { useUser } from "@/hooks/useuser";
import { useRouter } from "next/navigation";
import Input from "./input";
import Button from "./button";
import uniqid from "uniqid";

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);

  const uploadModal = useuploadmodal();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const router = useRouter();
    
    const {
        register,
        handleSubmit,
        reset,
      } = useForm<FieldValues>({
        defaultValues: {
            author: '',
            title: '',
            song: null,
            image: null,
          }
    });

    const onChange = (open: boolean) => {
        if (!open) {
            reset();
            uploadModal.onClose();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true);

            const imageFile = values.image?.[0];
            const songFile = values.song?.[0];
      
            if (!imageFile || !songFile || !user) {
              toast.error('Missing Fields')
              return;
            }
      
            const uniqueID = uniqid();
      
            // Upload song
            const { 
              data: songData, 
              error: songError 
            } = await supabaseClient
              .storage
              .from('songs')
              .upload(`song-${values.title}-${uniqueID}`, songFile, {
                cacheControl: '3600',
                upsert: false
              });
      
            if (songError) {
              setIsLoading(false);
              return toast.error('Failed Song upload');
            }
      
            // Upload image
            const { 
              data: imageData, 
              error: imageError
            } = await supabaseClient
              .storage
              .from('images')
              .upload(`image-${values.title}-${uniqueID}`, imageFile, {
                cacheControl: '3600',
                upsert: false
              });
      
            if (imageError) {
              setIsLoading(false);
              return toast.error('Failed Image upload');
            }
      
            
            // Create record 
            const { error: supabaseError } = await supabaseClient
              .from('songs')
              .insert({
                user_id: user.id,
                title: values.title,
                author: values.author,
                image_path: imageData.path,
                song_path: songData.path
              });
      
            if (supabaseError) {
              return toast.error(supabaseError.message);
            }
            
            router.refresh();
            setIsLoading(false);
            toast.success('Song Created!');
            reset();
            uploadModal.onClose();
        }catch (error) {
          toast.error("Something went wrong");
        }finally {
          setIsLoading(false);
        }
    }
    return ( 
        <Modal title="Add a song"
        description="Upload an mp3 File"
        isOpen={uploadModal.isOpen}
        onChange={onChange}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <Input id="title" disabled={isLoading} {...register('title', {required: true})} placeholder="Song Title"/>
                <Input id="author" disabled={isLoading} {...register('author', {required: true})} placeholder="Song Author"/>
                <div>
                  <div className="pb-1">
                    Select a song File
                  </div>
                  <Input id="song" disabled={isLoading} {...register('song', {required: true})} type="file" accept=".mp3"/>
                </div>
                <div>
                  <div className="pb-1">
                    Select an Image
                  </div>
                  <Input id="image" disabled={isLoading} {...register('image', {required: true})} type="file" accept="image/*"/>
                </div>
                <Button disabled={isLoading} type="submit">
                  Create
                </Button>
            </form>
        </Modal>
     );
}
 
export default UploadModal;