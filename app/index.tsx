import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTasks } from '@/context/TaskContext';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function LandingPage() {
    const router = useRouter();
    const { branding } = useTasks();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={styles.logoContainer}>
                        {branding?.logoUrl ? (
                            <Image source={{ uri: branding.logoUrl }} style={styles.logo} />
                        ) : (
                            <View style={[styles.logoPlaceholder, { backgroundColor: branding?.primaryColor || '#5B9EF8' }]}>
                                <IconSymbol name="book.fill" size={40} color="#FFF" />
                            </View>
                        )}
                    </View>

                    <Text style={styles.appName}>{branding?.name || 'School To-Do'}</Text>
                    <Text style={styles.tagline}>{branding?.tagline || 'Stay organized, stay ahead.'}</Text>
                </View>

                {/* Features Section */}
                <View style={styles.featuresContainer}>
                    <FeatureItem
                        icon="list.bullet"
                        title="Track Assignments"
                        description="Keep all your homework and projects in one place."
                        color="#5B9EF8"
                    />
                    <FeatureItem
                        icon="bell"
                        title="Never Miss a Deadline"
                        description="Get reminders for upcoming exams and tasks."
                        color="#FF9F47"
                    />
                    <FeatureItem
                        icon="tag"
                        title="Organize by Subject"
                        description="Categorize tasks by class, club, or personal goals."
                        color="#54E69D"
                    />
                </View>

                {/* Call to Action */}
                <View style={styles.ctaContainer}>
                    <TouchableOpacity
                        style={[styles.primaryButton, { backgroundColor: branding?.primaryColor || '#5B9EF8' }]}
                        onPress={() => router.replace('/(tabs)')}
                    >
                        <Text style={styles.primaryButtonText}>Get Started</Text>
                        <IconSymbol name="chevron.right" size={20} color="#FFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => router.push('/login')}
                    >
                        <Text style={styles.secondaryButtonText}>Admin Login</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

function FeatureItem({ icon, title, description, color }: { icon: string, title: string, description: string, color: string }) {
    return (
        <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: color + '20' }]}>
                <IconSymbol name={icon as any} size={28} color={color} />
            </View>
            <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{title}</Text>
                <Text style={styles.featureDescription}>{description}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
        justifyContent: 'space-between',
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: 48,
    },
    logoContainer: {
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 24,
        resizeMode: 'contain',
    },
    logoPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    appName: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1C1C1E',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    tagline: {
        fontSize: 18,
        color: '#8E8E93',
        textAlign: 'center',
        fontWeight: '500',
        maxWidth: '80%',
    },
    featuresContainer: {
        marginBottom: 48,
        gap: 24,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    featureIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureText: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 15,
        color: '#636366',
        lineHeight: 20,
    },
    ctaContainer: {
        gap: 16,
    },
    primaryButton: {
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#5B9EF8',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    secondaryButton: {
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#8E8E93',
    },
});
