import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  SafeAreaView,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Send, MoreHorizontal, DollarSign, CreditCard, X, CheckCircle, Star } from 'lucide-react-native';
import ReviewModal from '@/components/ReviewModal';
import { Message } from '@/types/message';
import { mockConversations } from '@/mocks/conversations';
import { useAuth } from '@/hooks/auth-store';

interface ChatMessage extends Message {
  isOwn: boolean;
  type?: 'user' | 'system';
}

interface PaymentRequest {
  serviceTitle: string;
  amount: string;
  notes: string;
}

interface EscrowPayment {
  amount: number;
  serviceTitle: string;
  timestamp: string;
}

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    receiverId: 'current',
    content: 'Hi! I saw your request for web development services. I have 5+ years of experience building modern websites.',
    timestamp: '2024-01-15T09:00:00Z',
    read: true,
  },
  {
    id: '2',
    senderId: 'current',
    receiverId: '1',
    content: 'That sounds great! Could you tell me more about your experience with React and Node.js?',
    timestamp: '2024-01-15T09:15:00Z',
    read: true,
  },
  {
    id: '3',
    senderId: '1',
    receiverId: 'current',
    content: 'Absolutely! I\'ve been working with React for 4 years and Node.js for 3 years. I can show you some of my recent projects.',
    timestamp: '2024-01-15T09:30:00Z',
    read: true,
  },
  {
    id: '4',
    senderId: 'current',
    receiverId: '1',
    content: 'Perfect! What\'s your typical timeline for a project like this?',
    timestamp: '2024-01-15T10:00:00Z',
    read: true,
  },
  {
    id: '5',
    senderId: '1',
    receiverId: 'current',
    content: 'Thanks for your interest in my web development service! I can definitely help you create a modern website.',
    timestamp: '2024-01-15T10:30:00Z',
    read: false,
  },
];

export default function ChatScreen() {
  const { id, paymentComplete } = useLocalSearchParams<{ 
    id: string;
    paymentComplete?: string;
  }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [showActionsSheet, setShowActionsSheet] = useState(false);
  const [showPaymentRequestForm, setShowPaymentRequestForm] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest>({
    serviceTitle: '',
    amount: '',
    notes: ''
  });
  const [escrowPayment, setEscrowPayment] = useState<EscrowPayment | null>(null);
  const [jobCompleted, setJobCompleted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showReviewInvitation, setShowReviewInvitation] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
  const conversation = mockConversations.find(c => c.id === id);
  const otherParticipant = conversation?.participants.find(p => p.id !== 'current');

  useEffect(() => {
    const chatMessages: ChatMessage[] = mockMessages.map(msg => ({
      ...msg,
      isOwn: msg.senderId === 'current',
      type: 'user' as const,
    }));
    setMessages(chatMessages);
  }, []);

  // Handle payment completion from checkout
  useEffect(() => {
    if (paymentComplete) {
      const amount = parseFloat(paymentComplete);
      if (!isNaN(amount)) {
        const payment: EscrowPayment = {
          amount,
          serviceTitle: 'Web Development Service', // Mock service title
          timestamp: new Date().toISOString()
        };
        setEscrowPayment(payment);
        addSystemMessage(`Payment of ${amount} placed in escrow.`);
        // Clear the parameter to prevent duplicate messages
        router.replace(`/chat/${id}`);
      }
    }
  }, [paymentComplete, id]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: 'current',
        receiverId: otherParticipant?.id || '1',
        content: inputText.trim(),
        timestamp: new Date().toISOString(),
        read: false,
        isOwn: true,
        type: 'user',
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
    }
  };

  const addSystemMessage = (content: string) => {
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'system',
      receiverId: 'system',
      content,
      timestamp: new Date().toISOString(),
      read: true,
      isOwn: false,
      type: 'system',
    };
    
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleActionsPress = () => {
    setShowActionsSheet(true);
  };

  const handleSheetClose = useCallback(() => {
    setShowActionsSheet(false);
  }, []);

  const handleRequestPayment = () => {
    setShowPaymentRequestForm(true);
    handleSheetClose();
  };

  const handleMakePayment = () => {
    // Navigate to checkout with mock service data
    const mockServiceId = 'service_1'; // In real app, this would come from conversation context
    router.push(`/checkout?id=${mockServiceId}&fromChat=true&chatId=${id}`);
    handleSheetClose();
  };

  const submitPaymentRequest = () => {
    if (!paymentRequest.serviceTitle || !paymentRequest.amount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const amount = parseFloat(paymentRequest.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    // Add system message for payment request
    addSystemMessage(
      `Payment request sent: ${paymentRequest.serviceTitle} - ${amount}${paymentRequest.notes ? ` (${paymentRequest.notes})` : ''}`
    );

    // Reset form
    setPaymentRequest({ serviceTitle: '', amount: '', notes: '' });
    setShowPaymentRequestForm(false);
  };

  const handleMarkJobComplete = () => {
    setShowCompletionModal(true);
  };

  const confirmJobCompletion = () => {
    if (!escrowPayment) return;

    // Mark job as completed
    setJobCompleted(true);
    setShowCompletionModal(false);

    // Add system message
    addSystemMessage(`Job marked complete. Payment of ${escrowPayment.amount} released to contractor.`);

    // Mock: Update contractor's balance (in real app, this would be an API call)
    console.log(`Contractor balance updated: +${escrowPayment.amount}`);

    // Show review invitation after a short delay
    setTimeout(() => {
      setShowReviewInvitation(true);
    }, 1000);
  };

  const handleLeaveReview = () => {
    setShowReviewInvitation(false);
    setShowReviewModal(true);
  };

  const skipReview = () => {
    setShowReviewInvitation(false);
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    if (item.type === 'system') {
      return (
        <View style={styles.systemMessageContainer}>
          <View style={styles.systemMessageBubble}>
            <Text style={styles.systemMessageText}>{item.content}</Text>
            <Text style={styles.systemMessageTime}>
              {formatMessageTime(item.timestamp)}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={[
        styles.messageContainer,
        item.isOwn ? styles.ownMessageContainer : styles.otherMessageContainer
      ]}>
        {!item.isOwn && (
          <Image 
            source={{ uri: otherParticipant?.avatar || 'https://via.placeholder.com/30' }}
            style={styles.messageAvatar}
          />
        )}
        
        <View style={[
          styles.messageBubble,
          item.isOwn ? styles.ownMessageBubble : styles.otherMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            item.isOwn ? styles.ownMessageText : styles.otherMessageText
          ]}>
            {item.content}
          </Text>
          <Text style={[
            styles.messageTime,
            item.isOwn ? styles.ownMessageTime : styles.otherMessageTime
          ]}>
            {formatMessageTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: otherParticipant?.name || 'Chat',
            headerBackTitle: 'Messages',
            headerRight: () => {
              // Show "Mark Job Complete" button for clients when payment is in escrow and job not completed
              if (user?.type === 'client' && escrowPayment && !jobCompleted) {
                return (
                  <TouchableOpacity 
                    onPress={handleMarkJobComplete}
                    style={styles.headerButton}
                  >
                    <CheckCircle size={20} color="#1DBF73" />
                    <Text style={styles.headerButtonText}>Complete</Text>
                  </TouchableOpacity>
                );
              }
              return null;
            }
          }} 
        />
        
        <KeyboardAvoidingView 
          style={styles.container} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              multiline
              maxLength={500}
              onSubmitEditing={sendMessage}
              blurOnSubmit={false}
            />
            <TouchableOpacity 
              style={[
                styles.sendButton,
                inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim()}
            >
              <Send 
                size={20} 
                color={inputText.trim() ? 'white' : '#999'} 
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {/* Floating Actions Button */}
        <TouchableOpacity 
          style={styles.actionsButton}
          onPress={handleActionsPress}
        >
          <MoreHorizontal size={24} color="white" />
        </TouchableOpacity>

        {/* Actions Modal */}
        <Modal
          visible={showActionsSheet}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={handleSheetClose}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                onPress={handleSheetClose}
                style={styles.modalCloseButton}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Actions</Text>
              <View style={styles.modalCloseButton} />
            </View>
            
            <View style={styles.bottomSheetContent}>
              {user?.type === 'contractor' && (
                <TouchableOpacity 
                  style={styles.actionItem}
                  onPress={handleRequestPayment}
                >
                  <DollarSign size={24} color="#1DBF73" />
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>Request Payment</Text>
                    <Text style={styles.actionSubtitle}>Send a payment request to client</Text>
                  </View>
                </TouchableOpacity>
              )}
              
              {user?.type === 'client' && (
                <TouchableOpacity 
                  style={styles.actionItem}
                  onPress={handleMakePayment}
                >
                  <CreditCard size={24} color="#1DBF73" />
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>Make Payment (Escrow)</Text>
                    <Text style={styles.actionSubtitle}>Pay for service securely</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </SafeAreaView>
        </Modal>

        {/* Payment Request Form Modal */}
        <Modal
          visible={showPaymentRequestForm}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                onPress={() => setShowPaymentRequestForm(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Request Payment</Text>
              <TouchableOpacity 
                onPress={submitPaymentRequest}
                style={styles.modalSubmitButton}
              >
                <Text style={styles.modalSubmitText}>Send</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Service Title *</Text>
                <TextInput
                  style={styles.formInput}
                  value={paymentRequest.serviceTitle}
                  onChangeText={(text) => setPaymentRequest(prev => ({ ...prev, serviceTitle: text }))}
                  placeholder="Enter service title"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Amount *</Text>
                <TextInput
                  style={styles.formInput}
                  value={paymentRequest.amount}
                  onChangeText={(text) => setPaymentRequest(prev => ({ ...prev, amount: text }))}
                  placeholder="0.00"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Notes (Optional)</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextArea]}
                  value={paymentRequest.notes}
                  onChangeText={(text) => setPaymentRequest(prev => ({ ...prev, notes: text }))}
                  placeholder="Add any additional notes..."
                  multiline
                  numberOfLines={4}
                />
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>

        {/* Job Completion Confirmation Modal */}
        <Modal
          visible={showCompletionModal}
          animationType="fade"
          transparent
          onRequestClose={() => setShowCompletionModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.confirmationModal}>
              <CheckCircle size={48} color="#1DBF73" style={styles.confirmationIcon} />
              <Text style={styles.confirmationTitle}>Mark Job Complete?</Text>
              <Text style={styles.confirmationText}>
                This will release the payment of ${escrowPayment?.amount} to the contractor. This action cannot be undone.
              </Text>
              
              <View style={styles.confirmationButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowCompletionModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.confirmButton}
                  onPress={confirmJobCompletion}
                >
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Review Invitation Modal */}
        <Modal
          visible={showReviewInvitation}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={skipReview}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                onPress={skipReview}
                style={styles.modalCloseButton}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Job Complete!</Text>
              <View style={styles.modalCloseButton} />
            </View>
            
            <View style={styles.reviewInvitationContent}>
              <Star size={64} color="#FFD700" fill="#FFD700" style={styles.reviewIcon} />
              
              <Text style={styles.reviewInvitationTitle}>
                How was your experience?
              </Text>
              
              <Text style={styles.reviewInvitationText}>
                Help other users by sharing your experience with {otherParticipant?.name}. Your feedback helps maintain quality on our platform.
              </Text>
              
              <View style={styles.reviewInvitationButtons}>
                <TouchableOpacity 
                  style={styles.reviewButton}
                  onPress={handleLeaveReview}
                >
                  <Text style={styles.reviewButtonText}>Leave Review</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.skipReviewButton}
                  onPress={skipReview}
                >
                  <Text style={styles.skipReviewButtonText}>Maybe Later</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Modal>

        {/* Review Modal */}
        {user && otherParticipant && (
          <ReviewModal
            visible={showReviewModal}
            onClose={() => setShowReviewModal(false)}
            reviewee={{
              id: otherParticipant.id,
              name: otherParticipant.name,
              avatar: otherParticipant.avatar,
            }}
            reviewer={user}
            serviceId="service_1"
            onSubmitSuccess={() => {
              console.log('Review submitted successfully');
            }}
          />
        )}
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  ownMessageBubble: {
    backgroundColor: '#1DBF73',
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  ownMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: '#1a1a1a',
  },
  messageTime: {
    fontSize: 11,
    fontWeight: '500',
  },
  ownMessageTime: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
    backgroundColor: '#f8f9fa',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#1DBF73',
  },
  sendButtonInactive: {
    backgroundColor: '#f0f0f0',
  },
  systemMessageContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  systemMessageBubble: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    maxWidth: '80%',
  },
  systemMessageText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  systemMessageTime: {
    fontSize: 10,
    color: '#adb5bd',
    textAlign: 'center',
    marginTop: 4,
  },
  actionsButton: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1DBF73',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  modalSubmitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1DBF73',
    borderRadius: 8,
  },
  modalSubmitText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  formTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f9f4',
    borderRadius: 16,
    marginRight: 8,
  },
  headerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1DBF73',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmationModal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
  },
  confirmationIcon: {
    marginBottom: 16,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  confirmationText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  confirmationButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#1DBF73',
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  reviewInvitationContent: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewIcon: {
    marginBottom: 24,
  },
  reviewInvitationTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  reviewInvitationText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  reviewInvitationButtons: {
    width: '100%',
    gap: 12,
  },
  reviewButton: {
    backgroundColor: '#1DBF73',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  reviewButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  skipReviewButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  skipReviewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});