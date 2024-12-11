<script setup lang="ts">
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Copy } from 'lucide-vue-next'
import { useToast} from "@/shared/ui/toast";

const { toast} = useToast()

const props = defineProps({
  label: String,
  description: String,
  url: String,
  buttonText: String
})

const copyToClipboard = async () => {
  try {
    const inputElement = document.getElementById('link') as HTMLInputElement
    if (inputElement) {
      inputElement.select()
      inputElement.setSelectionRange(0, 99999)
      await navigator.clipboard.writeText(inputElement.value)
      toast({
        title: 'Успех',
        description: `Скопирован текст ${inputElement.value}`
      })
    }
  } catch (err) {
    console.error('Ошибка при копировании: ', err)
    toast({
      title: 'Ошибка при копировании',
      description: `Вы выпались скопировать ${inputElement.value}`,
      type: 'danger'
    })
  }
}
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="outline">
        <span class="sr-only">Копировать</span>
        <Copy class="w-4 h-4" />
      </Button>
    </DialogTrigger>
    <DialogContent class="max-w-[300px] sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ props.label }}</DialogTitle>
        <DialogDescription>
          {{ props.description }}
        </DialogDescription>
      </DialogHeader>
      <div class="flex items-center space-x-2">
        <div class="grid flex-1 gap-2">
          <Label for="link" class="sr-only">
            Ссылка
          </Label>
          <Input
              id="link"
              :default-value="props.url"
              read-only
          />
        </div>
        <Button type="button" size="sm" class="px-3" @click="copyToClipboard">
          <span class="sr-only">Копировать</span>
          <Copy class="w-4 h-4" />
        </Button>
      </div>
      <DialogFooter class="sm:justify-start">
        <DialogClose as-child>
          <Button type="button" variant="secondary">
            Закрыть
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
