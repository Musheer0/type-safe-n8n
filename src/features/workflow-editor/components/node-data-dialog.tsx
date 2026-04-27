"use client"
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import React from 'react'
export interface nodedataformprops {
    children:React.ReactNode,
    title:string,
    description?:string,
    form:React.ReactNode,
    onSave:()=>void,
    isSaving?:boolean
}
const NodeDataForm:React.FC<nodedataformprops> = ({children,title,description,form,onSave=()=>{},isSaving}) => {
  return (
    <Dialog>
        <DialogTrigger>
            {children}
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {title}
                </DialogTitle>
                <DialogDescription>
                    {description}
                </DialogDescription>
            </DialogHeader>
                {form}
            <DialogFooter>
                <DialogClose asChild onClick={onSave}>
                    <Button disabled={isSaving}>Saved Changes</Button>
                </DialogClose>
                
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default NodeDataForm